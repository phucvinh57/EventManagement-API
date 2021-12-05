# **Mô tả**

App backend Node.js cung cấp RESTful API cho ứng dụng quản lý sự kiện. <br>
Nhiệm vụ của team frontend là sử dụng các API được cung cấp xây dựng ứng dụng phía người dùng.
<br>

# **Cài đặt**

Để chạy ứng dụng, cần cài đặt môi trường [Node.js và npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) và [MongoDB Community Server](https://www.mongodb.com/try/download/community). <br>

Sau khi cài đặt xong DBMS và environment, tạo một thư mục mới chứa project:

```console
mkdir event_management
cd event_management
```

Clone các repo cần thiết:

```console
git clone https://github.com/phucvinh57/EventManagement−API.git
git clone https://gitlab.com/caothanhbinh/frontend_eventmanagement.git
```

Ta sẽ chạy hai ứng dụng ở hai thư mục khác nhau: EventManagement−API (đổi tên thành node-server) và frontend_eventmanagement (đổi tên thành react-app). Ứng dụng nằm trong thư mục react-app là frontend hiển thị giao diện UI, ứng dụng trong thư mục node-server là CRUD App dùng để lấy dữ liệu từ Mongo Atlas Cloud, xử lí logic và trả về dữ liệu cho React App thông qua các REST API. <br>

## **Chạy ứng dụng node-server:**
Chuyển working directory sang thư mục node-server:
```console
cd node-server
```
Cài đặt các dependency cần thiết:
```console
npm install
```
Chạy ứng dụng:
```console
node server.js
```
Ứng dụng node-server được chạy mặc định trên [localhost](http://localhost:8080) port 8080.

## **Chạy ứng dụng react-app:**
Chuyển working directory sang thư mục react-app:
```console
cd react-app
```
Cài đặt các dependency cần thiết:
```console
npm install
```
Chạy ứng dụng:
```console
npm start
```
Ứng dụng node-server được chạy mặc định trên [localhost](http://localhost:3000) port 3000.
Lưu ý, ứng dụng Node server phải được chạy trước ứng dụng React.
