```js

🏢 HỆ THỐNG QUẢN LÝ BẤT ĐỘNG SẢN THÔNG MINH 🏢

const PROJECT = {
  description: "Một giải pháp mã nguồn mở hiện đại, tích hợp AI để quản lý bất động sản hiệu quả.",
  slogan: "Chuyển đổi số ngành bất động sản với công nghệ AI và giao diện người dùng thân thiện."
};

// Giới thiệu dự án
const introduction = `
${PROJECT.name}

${PROJECT.description}
${PROJECT.slogan}

🔍 GIỚI THIỆU
Hệ Thống Quản Lý Bất Động Sản Thông Minh là một nền tảng mã nguồn mở giúp tối ưu hóa 
việc quản lý và tương tác với bất động sản. Dự án tích hợp các công nghệ tiên tiến 
như AI, xử lý dữ liệu thời gian thực và giao diện người dùng hiện đại để mang lại 
trải nghiệm quản lý hiệu quả, thông minh.
`;

console.log(introduction);

// Tầm nhìn dự án
const vision = [
  "Chuyển đổi số ngành bất động sản với công nghệ AI tiên tiến.",
  "Cung cấp giải pháp toàn diện, dễ sử dụng cho mọi nhu cầu quản lý bất động sản."
];

console.log("\n🔭 TẦM NHÌN");
vision.forEach(item => console.log(`✓ ${item}`));

// Công nghệ sử dụng
const technologies = {
  docker: {
    name: "🐳 Dockerized Setup",
    description: "Triển khai nhanh chóng và linh hoạt với Docker Compose.",
    example: `
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - database
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  database:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: admin
      POSTGRES_DB: realestate`
  },
  springBoot: {
    name: "🌀 Spring Boot Backend",
    description: "API RESTful mạnh mẽ, đáng tin cậy cho toàn bộ hệ thống.",
    example: `
// PropertyController.java
@RestController
@RequestMapping("/api/properties")
public class PropertyController {
    @Autowired
    private PropertyService propertyService;
    
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.findAll();
    }
    
    @PostMapping
    public Property createProperty(@RequestBody Property property) {
        return propertyService.save(property);
    }
}`
  },
  react: {
    name: "⚛️ React Frontend",
    description: "Giao diện người dùng mượt mà, thân thiện với ReactJS.",
    example: `
// PropertyCard.jsx
import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <img src={property.imageUrl || "/placeholder.svg"} alt={property.title} />
      <h3>{property.title}</h3>
      <p className="price">${property.price.toLocaleString()}</p>
      <p className="location">{property.location}</p>
      <div className="stats">
        <span>{property.bedrooms} beds</span>
        <span>{property.bathrooms} baths</span>
        <span>{property.area} sqft</span>
      </div>
      <button className="view-details">View Details</button>
    </div>
  );
};

export default PropertyCard;`
  },
  geminiAI: {
    name: "🤖 Gemini AI",
    description: "Phân tích dữ liệu thông minh với Google Gemini AI.",
    example: `
// gemini-client.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function analyzePropertyData(propertyData) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = \`
    Analyze this real estate property data and provide insights:
    \${JSON.stringify(propertyData)}
  \`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}`
  },
  flask: {
    name: "🐍 Flask Service",
    description: "Xử lý tác vụ nền và dữ liệu chuyên sâu với Flask.",
    example: `
# app.py
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)

@app.route('/api/predict-price', methods=['POST'])
def predict_price():
    data = request.json
    
    # Prepare features
    features = pd.DataFrame([{
        'area': data['area'],
        'bedrooms': data['bedrooms'],
        'bathrooms': data['bathrooms'],
        'location_score': data['locationScore'],
        'year_built': data['yearBuilt']
    }])
    
    # Load model and predict
    model = RandomForestRegressor()
    model = joblib.load('price_prediction_model.pkl')
    prediction = model.predict(features)[0]
    
    return jsonify({
        'predicted_price': round(prediction, 2),
        'confidence': 0.85
    })`
  },
  deepseekAI: {
    name: "🧠 DeepSeek AI",
    description: "Tăng cường xử lý ngôn ngữ tự nhiên và tương tác người dùng.",
    example: `
// chatbot-service.js
import { DeepSeekAI } from 'deepseek-ai';

const deepseek = new DeepSeekAI({
  apiKey: process.env.DEEPSEEK_API_KEY
});

async function handleUserQuery(query) {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a real estate assistant." },
      { role: "user", content: query }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  return response.choices[0].message.content;
}`
  }
};

console.log("\n🛠️ CÔNG NGHỆ SỬ DỤNG");
Object.values(technologies).forEach(tech => {
  console.log(`${tech.name}\n┗━ ${tech.description}`);
});

// Hiển thị ví dụ mã cho một công nghệ
console.log("\n📝 VÍ DỤ MÃ REACT FRONTEND:");
console.log(technologies.react.example);

console.log("\n📝 VÍ DỤ MÃ SPRING BOOT BACKEND:");
console.log(technologies.springBoot.example);

// Các chức năng chính
const features = [
  { icon: "📍", name: "Xem bản đồ bất động sản", description: "Hiển thị vị trí chi tiết trên bản đồ" },
  { icon: "🤖", name: "Chat với AI", description: "Tương tác thông minh với trợ lý ảo" },
  { icon: "📈", name: "Đấu giá thời gian thực", description: "Tham gia và theo dõi các phiên đấu giá" },
  { icon: "📊", name: "Thống kê lãi suất", description: "Phân tích chi phí thuê/mua bất động sản" },
  { icon: "🔐", name: "Đăng nhập/Đăng ký", description: "Hệ thống xác thực người dùng an toàn" },
  { icon: "📜", name: "Quản lý hợp đồng", description: "Tạo và theo dõi hợp đồng bất động sản" },
  { icon: "🏠", name: "Quản lý thuê/mua nhà", description: "Quy trình thuê và mua dễ dàng" },
  { icon: "🔥", name: "Quản lý hệ thống báo cháy", description: "Giám sát an toàn bất động sản" },
  { icon: "💳", name: "Quản lý thanh toán", description: "Xử lý giao dịch tài chính nhanh chóng" },
  { icon: "👥", name: "Quản lý khách hàng", description: "CRM tích hợp cho quản lý người dùng" }
];

console.log("\n🧩 CÁC CHỨC NĂNG CHÍNH");
features.forEach(feature => {
  console.log(`${feature.icon} ${feature.name.padEnd(25)} | ${feature.description}`);
});

// Đội ngũ phát triển
const contributors = [
  { name: "Nguyễn Ngọc Khánh", role: "Backend Developer" },
  { name: "Phùng Văn Mạnh", role: "Fullstack Developer" },
  { name: "Nguyễn Khắc Hoài Nam", role: "Frontend Developer" },
  { name: "Trần Ngọc Tiến", role: "Frontend Developer" },
  { name: "Trần Thế Tường", role: "Fullstack Developer" }
];

console.log("\n👨‍💻 ĐÓNG GÓP");
contributors.forEach(person => {
  console.log(`★ ${person.name.padEnd(22)} - ${person.role}`);
});

```
