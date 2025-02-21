import pandas as pd

# Example dataset
data = {
    "message": [
        "Căn nhà đẹp ở Hải Châu, Đà Nẵng",
        "Biệt thự sang trọng tại Ngũ Hành Sơn, Đà Nẵng",
        "Nhà phố hiện đại ở Thanh Khê, Đà Nẵng",
        "Biệt thự ven biển ở Liên Chiểu, Đà Nẵng",
        "Nhà nghỉ dưỡng tại Cẩm Lệ, Đà Nẵng"
    ],
    "name": ["Căn nhà đẹp", "Biệt thự sang trọng", "Nhà phố hiện đại", "Biệt thự ven biển", "Nhà nghỉ dưỡng"],
    "acreage": [100, 500, 200, 300, 150],
    "number_of_basement": [0, 1, 0, 2, 1],
    "description": [
        "Nhà đẹp, gần trung tâm",
        "Biệt thự lớn, view biển",
        "Nhà phố gần chợ",
        "Biệt thự ven biển, hiện đại",
        "Nhà nghỉ dưỡng, yên tĩnh"
    ]
}

# Save to CSV
df = pd.DataFrame(data)
df.to_csv('training_data.csv', index=False)
print("Data saved to real_estate_data.csv")
