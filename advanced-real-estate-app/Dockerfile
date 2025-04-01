# Sử dụng base image Node.js
FROM node:18

# Set thư mục làm việc
WORKDIR /var/www/html/RMS/FE

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Expose port
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
