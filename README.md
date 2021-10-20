# **Mô tả**

App backend Node.js cung cấp RESTful API cho ứng dụng quản lý sự kiện. <br>
Nhiệm vụ của team frontend là sử dụng các API được cung cấp xây dựng ứng dụng phía người dùng.
<br>
<br>

# **Cài đặt**

Để chạy ứng dụng backend, cần cài đặt môi trường [Node.js và npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) và [MySQL](https://www.mysql.com/downloads/).
Sau khi cài đặt xong Node.js và npm, cài đặt các package sau:

```console
npm install express mysql2 cors
```

Tạo schema có tên là `event_management`, chỉnh sửa USER và PASSWORD trong file  *app/config/db.config.js* phù hợp với RDBMS của máy:
```javascript
module.exports = {
    HOST: 'localhost',
    USER: "root",
    PASSWORD: "********",
    DB: "event_management",
}
```
Chạy ứng dụng trên [localhost](http://localhost:8080) port 8080 (có thể chỉnh sửa port trong file *server.js*):

```console
npm start
```

<br>

# **Cách sử dụng các API lấy dữ liệu cho frontend**

**Lưu ý**: Với các POST và PUT method, đặt tên dữ liệu đúng định dạng như trong phần _Description_

## ***Đăng nhập và đăng ký:***

### **API**

Method | URL | Description
-----|--------|-------
POST | /auth/login | Gửi tên 'username'/'email', 'password' lên server. Khi đăng nhập thành công, một Json Web Token (JWT) chứa ID của user được tạo vào lưu vào cookie. Nếu user đang có sẵn JWT hợp lệ, bỏ qua phần đăng nhập.
POST | /auth/signup | Gửi tên 'username'/'email', 'password', 'fname' và 'lname' lên server. Nếu tên tài khoản đã tồn tại, trả về thất bại. Nếu tài khoản được tạo thành công, lưu JWT tương tự như phần đăng nhập.

<br>

## ***Lịch:***

### **API**

Method | URL | Description | Return
-----|--------|-------|----------
GET |/calendar?month={`int`}&year={`int`} | Lấy lịch tổng quan trong tháng | Một array gồm các object chứa màu và ngày diễn ra của sự kiện
GET |/calendar?day={`int`}&month={`int`}&year={`int`} | Lấy danh sách các sự kiện trong một ngày | Một array gồm các object chứa id, thời gian, màu, địa điểm, tên sự kiện

### **Parameters**

Name | | Description |
------|------|----
month | required | Số tháng từ 1 tới 12 |
year | required | Số năm
day | required | Số ngày trong tháng

<br>

## ***Sự kiện:***

### **API**

Method | URL | Description |Return
-----|--------|-----|----------
GET |/event/basic?id={`int`} | Lấy thêm thông tin sơ bộ về một sự kiện thông qua id. Kết hợp với dữ liệu đã lấy được từ URL ``/calendar?day={`int`}month={`int`}&year={`int`}``, dùng để hiển thị sơ bộ sự kiện dưới dạng pop-ups ngay trên trang chủ | Một object chứa thông tin thêm về sự kiện có id được cung cấp, cụ thể là một object chứa chu kì, mô tả, số khách mời.
GET |/event/:`id` | Lấy thông tin chi tiết về một sự kiện thông qua id, dùng để hiển thị đầy đủ sự kiện trên 1 trang | Một object chứa đầy đủ thông tin về sự kiện đó
GET | /event/:`id`/invitation | Lấy danh sách thông tin các lời mời tham dự | Danh sách lời mời
POST | /event | Tạo mới một event và gửi tất cả các thông tin về event đó lên server. Thông tin bao gồm 'name', 'startTime', 'endTime', .... (đoạn này chưa hoàn thiện) | Message
PUT | /event/:`id` | Cập nhật dữ liệu cho sự kiện với id cho trước. Thông tin dữ liệu giống `POST /event` | Message
DELETE | /event/:`id` | Xoá sự kiện có id cho trước | Message

### **Parameters**

Name | | Description
------|------|----
id | required| ID danh mục


<br>

## ***Lời mời tham dự sự kiện:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET |/event/:`id`/invite?list={`array`} | Gửi lời mời tới tất cả user có id trong danh sách | Message
GET |/event/:`id`/invite?userID={`int`} | Gửi lời mời tới user có id cụ thể | Message
GET |/event/:`id`/response?answer={`string`} | Phản hồi lời mời event, answer chỉ có thể là 'declined' hoặc 'accepted' | Message

### **Parameters**

Name | | Description
------|------|----
id | required| ID tài khoản
answer | required | String phản hồi lời mời

<br>

## ***Tìm kiếm:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET | /event/search?query={`string`} | Tìm kiếm sự kiện theo tên | Một object chứa ID của sự kiện, tên sự kiện, mô tả, thời gian bắt đầu và kết thúc
GET | /user/search?query={`string`} | Tìm kiếm người dùng theo tên, email hoặc số điện thoại | Một object chứa tên người dùng, ID, ảnh người dùng, email, SĐT

### **Parameters**

Name | | Description
------|------|----
query | required | String nhập từ input phía client

<br>

## ***Xếp lịch:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET | /event/:`id`/schedule | Lấy thông tin về thời gian của các khách mời để hiển thị bảng xếp lịch | Chi tiết cụ thể về từng khoảng thời gian có những ai bận, số lượng người có thể tham dự

### **Parameters**

Name | | Description
------|------|----
id | required| ID sự kiện

<br>

## ***Tài khoản:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET |/my | Lấy thông tin tài khoản cá nhân | Thông tin tài khoản cá nhân
PUST |/my/change_password | Đổi mật khẩu | Message
PUT |/my/change_info | Update thông tin cá nhân | Message
GET |/user?id={`int`} | Xem thông tin tài khoản người khác | Thông tin tài khoản với id cho trước
DELETE | /my | Xoá vĩnh viễn tài khoản cá nhân và các thông tin liên quan | Message

### **Parameters**

Name | | Description
------|------|----
id | required| ID tài khoản

<br>

# **JSON Response Data**
Ví dụ về một JSON response:
```javascript
{
    id: 12022021,
    name: 'Họp đồ án CNPM'
    startTime: '19:00',
    endTime: '20:00',
    description: 'Họp định kì hàng tuần, cập nhật tiến độ và phân chia công việc',
    date: '2021-10-20'
}
```
Các fields trong một *JSON response*:
- `userID`: ID của một user
- `eventID`: ID của một event
- 
