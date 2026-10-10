# Câu 32: base image
FROM node:20

# Câu 33: thư mục làm việc trong container
WORKDIR /app

# Câu 34: copy file khai báo dependency trước
COPY package*.json ./

# Câu 35: cài đặt package
RUN npm install

# Câu 36: copy toàn bộ source code (bao gồm cả thư mục server/)
COPY . .

# Câu 37: khai báo port backend dùng
EXPOSE 5000

# Câu 38: lệnh khởi động backend
CMD ["npm", "start"]