### Emerging Trend Identification Model

**Input:**
- Year
- Month
- Geographic Location

**Output:**
- Predicted Emerging Fashion-Trend Attributes:
  - BrandName
  - PrimaryColor
  - Size
  - Age Range
  - Material
  - Pattern
  - Style
  - Sub-Style
  - Sales Data (units)
  - Category_by_Gender
  - Category
  - Individual_Category

**Technology:**
The model is a RandomForestRegressor trained for multiple target variables such as brand, category, and sales data units based on year, month, and geographic location features.
It utilizes hyperparameter tuning via GridSearchCV for optimization, preprocessing steps including one-hot encoding and standard scaling, and serialization using joblib for efficient prediction and categorical value mapping.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Note:** Output of the Emerging Trend Identification model serves as the input for the Influencer Collaboration Selection Recommendation Model. 

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Influencer Collaboration Selection Recommendation Model

**Input:**
- BrandName
- PrimaryColor
- Size
- Age Range
- Material
- Pattern
- Style
- Sub-Style
- Category_by_Gender
- Category
- Individual_Category

**Output:**
- List of Top Recommended Influencers for Collaborations:
  - Influencer_id
  - Gender
  - Platform
  - Link
  - Followers
  - Public Perception
  - Engagement Metrics
  - Follower Locations
  - Followers Growth Rate
  - Style
  - Past Collaborations
  - Age Range
  - Influencer Score
  - Trend Alignment Score
  - Impact Score
  - Brand Fit Score

**Technology:**
A content-based recommender system selects top-N influencers based on criteria such as style, past collaborations, and demographic fit.
It preprocesses influencer data by standardizing numerical features, calculates match scores against given predictions, and ranks influencers by a final score combining match, impact, and brand fit weights. 
Serialized for reuse, it efficiently recommends influencers aligned with brand objectives, optimizing engagement and strategic partnerships.

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Scoring System for Brand Fit Score

**Scoring Criteria based on Myntra's Brand Values:**

1. **Customer Obsession:**
   - **followers:** Normalized number of followers.
   - **engagement_metrics:** Normalized engagement metrics.

2. **Operational Excellence:**
   - **public_perception:** Scores based on sentiment (e.g., mostly positive = 10, neutral = 5).
   - **past_collab:** Score based on the number and quality of past collaborations.

3. **Innovation:**
   - **style:** Score based on the variety and uniqueness in styles.

4. **Inclusivity:**
   - **follower_locations:** Score based on the diversity of follower locations.

5. **Sustainability:**
   - **past_collab:** Score based on the presence of eco-friendly brands in past collaborations.
