import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import gzip
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Load preprocessed influencer data and scaler
influencer_data = joblib.load('influencer_data_processed.pkl')
scaler = joblib.load('influencer_data_scaler.pkl')

# Load the trained models for trend identification
loaded_models = joblib.load('fashion_trend_models.pkl')

# Load the function to get top influencers

# Mapping dictionaries for categorical values
mappings = {
    'BrandName': {1: 'Allen Solly', 2: 'Levi\'s', 3: 'Adidas', 4: 'Gucci', 5: 'H&M', 6: 'Puma', 7: 'Nike', 8: 'Zara'},
    'Category': {1: 'Clothing', 2: 'Footwear', 3: 'Accessories'},
    'Individual_Category': {1: 'Jackets', 2: 'T-Shirts', 3: 'Boots', 4: 'Sweaters', 5: 'Hats', 6: 'Sweatshirts'},
    'Category_by_Gender': {1: 'Women', 2: 'Men', 3: 'Unisex'},
    'PrimaryColor': {1: 'Black', 2: 'White', 3: 'Blue', 4: 'Red', 5: 'Pink', 6: 'Yellow', 7: 'Green', 8: 'Purple', 9: 'Brown', 10: 'Orange'},
    'Size': {1: 'XS', 2: 'S', 3: 'M', 4: 'L', 5: 'XL', 6: 'XXL'},
    'Age Range': {1: '18-24', 2: '25-34', 3: '35-44'},
    'Material': {1: 'Wool', 2: 'Cotton', 3: 'Denim', 4: 'Leather', 5: 'Polyester'},
    'Pattern': {1: 'Solid', 2: 'Printed', 3: 'Floral', 4: 'Polka Dot', 5: 'Striped'},
    'Style': {1: 'Western Wear', 2: 'Casual Wear', 3: 'Sports and Active Wear', 4: 'Party Wear', 5: 'Minimalist Fashion', 6: 'Hiking', 7: 'Urban Fashion', 8: 'Streetwear'},
    'Sub-Style': {1: 'Regular Fit', 2: 'Crew Neck', 3: 'Windbreaker', 4: 'Heeled', 5: 'Loose Fit', 6: 'Fedora', 7: 'Hooded', 8: 'Hiking', 9: 'Bomber'}
}

geographic_location_mapping = {
    'Bangalore': 1,
    'Mumbai': 2,
    'Ahmedabad': 3,
    'Delhi': 4,
    'Jaipur': 5,
    'Pune': 6,
    'Hyderabad': 7,
    'Kolkata': 8,
    'Chennai': 9,
    'Chandigarh': 10
}

def preprocess_influencer_data(data):
    numerical_features = ['followers', 'engagement_metrics', 'follower_growth_rate']
    scaler = StandardScaler()
    data[numerical_features] = scaler.fit_transform(data[numerical_features])
    return data, scaler

def calculate_match_score(row, trend_params):
    match_score = 0
    for key, value in trend_params.items():
        if key in row and row[key] == value:
            match_score += 1
    return match_score

def get_top_influencers(influencer_data, predictions, scaler, top_n=10):
    numerical_features = ['followers', 'engagement_metrics', 'follower_growth_rate']
    influencer_data[numerical_features] = scaler.inverse_transform(influencer_data[numerical_features])

    influencer_data['match_score'] = influencer_data.apply(lambda row: calculate_match_score(row, predictions), axis=1)

    score_weights = {
        'impact_score': 0.70,
        'brand_fit_score': 0.30
    }

    influencer_data['final_score'] = (
        influencer_data['match_score'] +
        score_weights['impact_score'] * influencer_data['impact_score'] +
        score_weights['brand_fit_score'] * influencer_data['brand_fit_score']
    )

    top_influencers = influencer_data.sort_values(by='final_score', ascending=False)
    
    output_columns = ['influencer_id', 'gender', 'platform', 'link', 'followers', 'public_perception', 
                      'engagement_metrics', 'follower_locations', 'follower_growth_rate', 'style', 
                      'past_collab', 'age_range', 'impact_score', 'brand_fit_score', 'final_score']
    
    return top_influencers[output_columns].head(top_n)

historical_data = pd.read_csv('emerging_trend_identification_dataset.csv')


@app.route('/historical-data', methods=['GET'])
def get_historical_data():
    # Assuming historical_data is your DataFrame containing all historical data
    
    # Convert the entire dataset to JSON records
    response = historical_data.to_json(orient='records')
    
    # Return the response and appropriate headers
    return response, 200, {
        'Content-Type': 'application/json'
    }
@app.route('/predict', methods=['POST'])
def predict_and_recommend():
    data = request.json
    year = data.get('year')
    month_str = data.get('month')
    geographic_location_str = data.get('geographic_location')
    month_mapping = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5,
        'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10,
        'November': 11, 'December': 12
    }
    
    # Validate and convert user input
    try:
        month_int = month_mapping[month_str.title()]
        geographic_location_int = geographic_location_mapping[geographic_location_str.title()]
    except KeyError:
        return jsonify({"error": "Invalid Month or Geographic Location entered."}), 400
    
    # Prepare input data for prediction
    new_data = pd.DataFrame({
        'Year': [int(year)],
        'Month': [month_int],
        'Geographic Location': [geographic_location_int]
    })
    
    # Ensure all required columns are present
    all_columns = ['Year', 'Month', 'Geographic Location']
    for col in all_columns:
        if col not in new_data.columns:
            new_data[col] = 0
    
    new_data = new_data[all_columns]
    
    # Perform predictions using loaded trend identification models
    predictions = {}
    for target, pipeline in loaded_models.items():
        prediction = pipeline.predict(new_data)[0]
        predictions[target] = prediction
    
    rounded_predictions = {}
    for target, pred in predictions.items():
        if target in mappings:
            if isinstance(pred, np.float64):
                if target == 'Sales Data (units)':  
                    pred = int(np.round(pred))  
                else:
                    pred = np.round(pred)  
            mapped_value = mappings[target].get(pred, f'Unknown ({pred})')
            rounded_predictions[target] = mapped_value
        else:
            rounded_predictions[target] = int(pred) 
    
    # Get top influencers based on predictions
    top_influencers = get_top_influencers(influencer_data, rounded_predictions, scaler)
    
    # Convert top influencers to JSON serializable format
    top_influencers_json = top_influencers.to_dict(orient='records')
    
    return jsonify({
        'fashion_trends': rounded_predictions,
        'top_influencers': top_influencers_json
    })

if __name__ == '__main__':
    app.run(debug=True)
