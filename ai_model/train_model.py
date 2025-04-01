# import pickle
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.pipeline import make_pipeline
#
# # Example dataset
# data = {
#     "message": [
#         "Căn nhà đẹp ở Hải Châu, Đà Nẵng",
#         "Biệt thự sang trọng tại Ngũ Hành Sơn, Đà Nẵng",
#         "Nhà phố hiện đại ở Thanh Khê, Đà Nẵng",
#         "Biệt thự ven biển ở Liên Chiểu, Đà Nẵng",
#         "Nhà nghỉ dưỡng tại Cẩm Lệ, Đà Nẵng"
#     ],
#     "name": ["Căn nhà đẹp", "Biệt thự sang trọng", "Nhà phố hiện đại", "Biệt thự ven biển", "Nhà nghỉ dưỡng"],
#     "acreage": [100, 500, 200, 300, 150],
#     "number_of_basement": [0, 1, 0, 2, 1],
#     "description": [
#         "Nhà đẹp, gần trung tâm",
#         "Biệt thự lớn, view biển",
#         "Nhà phố gần chợ",
#         "Biệt thự ven biển, hiện đại",
#         "Nhà nghỉ dưỡng, yên tĩnh"
#     ]
# }
#
# df = pd.DataFrame(data)
#
# # Combine features into a training target
# df['target'] = df.apply(lambda row: f"{row['name']},{row['acreage']},{row['number_of_basement']},{row['description']}", axis=1)
#
# # Train a text classification model
# model = make_pipeline(TfidfVectorizer(), MultinomialNB())
# model.fit(df['message'], df['target'])
#
# # Save the model
# with open('ai_model.pkl', 'wb') as f:
#     pickle.dump(model, f)
#
# print("Model training complete and saved as ai_model.pkl.")
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Load data from CSV
df = pd.read_csv('training_data.csv')

# Combine target fields into a single string
df['target'] = df.apply(lambda row: f"{row['address']}|{row['district']}|{row['province']}|{row['name']}|{row['acreage']}|{row['number_of_basement']}|{row['description']}", axis=1)

# Train a text classification model
model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(df['message'], df['target'])

# Save the model
with open('ai_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Model training complete and saved as ai_model.pkl.")
