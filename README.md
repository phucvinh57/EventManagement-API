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
GET | /auth/logout | Đăng xuất tài khoản. | Trả về kết quả đăng xuất thành công
PUT | /auth/changePassword | Gửi 'password' mới lên server. | Trả về kết quả thay đổi mật khẩu thành công.

<br>

## ***Lịch:***

### **API**

Method | URL | Description | Return
-----|--------|-------|----------
GET |/calendar?month={`int`}&year={`int`} | Lấy lịch tổng quan trong tháng | Một array gồm các object chứa id, thời gian, màu, địa điểm, tên sự kiện
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
GET |/event/basic?id={`int`} | Lấy thông tin sơ bộ về một sự kiện thông qua id. Kết hợp với dữ liệu đã lấy được từ URL ``/calendar?day={`int`}month={`int`}&year={`int`}``, dùng để hiển thị sơ bộ sự kiện dưới dạng pop-ups ngay trên trang chủ | Một object chứa thông tin thêm về sự kiện có id được cung cấp, cụ thể là một object chứa chu kì, mô tả, số khách mời.
GET |/event/basics | Lấy thông tin sơ bộ về một số lượng sự kiện nhất định thông qua id của người dùng và số lượng được cung cấp. Dùng để hiển thị sơ bộ sự kiện dưới dạng thẻ ở cột danh sách sự kiện. | Một object chứa thông tin sơ bộ về các sự kiện, cụ thể là một object chứa tên sự kiện, ngày bắt đầu và thời gian bắt đầu của sự kiện.
GET |/event/:`id` | Lấy thông tin chi tiết về một sự kiện thông qua id, dùng để hiển thị đầy đủ sự kiện trên 1 trang | Một object chứa đầy đủ thông tin về sự kiện đó
GET | /event/:`id`/invitation | Lấy danh sách thông tin các lời mời tham dự | Danh sách lời mời
POST | /event | Tạo mới một event và gửi tất cả các thông tin về event đó lên server. Thông tin bao gồm 'name', 'startTime', 'endTime', 'location', 'desciption', 'option', 'setting', 'endCondition', 'guestIDs'| Một object chứa thông tin của sự kiện vừa được tạo cùng với ID được cung cấp bởi database.
PUT | /event/:`id` | Cập nhật dữ liệu cho sự kiện với id cho trước. Thông tin dữ liệu giống `POST /event` | Nếu cập nhật thành công, trả về true, ngược lại trả về false.
DELETE | /event/:`id` | Xoá sự kiện có id cho trước | Nếu xóa thành công, trả về true, ngược lại trả về false.

### **Parameters**

Name | | Description
------|------|----
id | required| ID danh mục


<br>

## ***Lời mời tham dự sự kiện:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET |/event/:`id`/invite?list={`array`} | Gửi lời mời tới tất cả user có email trong danh sách | Trả về các mảng gồm danh sách các email được mời, danh sách các email đã được mời rồi và danh sách email không tồn tại trong hệ thống.
GET |/event/:`id`/invite?email={`String`} | Gửi lời mời tới user có email cụ thể | Nếu email không tồn tại trả về thất bại, nếu email đã tồn tại trong danh sách mời thì trả về thông báo đã tồn tại, nếu email hợp lệ và chưa được mời thì trả về thành công.
GET |/event/:`id`/response?answer={`string`} | Phản hồi lời mời event, answer chỉ có thể là 'declined' hoặc 'accepted' | Trả về trạng thái phản hồi thành công.

### **Parameters**

Name | | Description
------|------|----
email | required| email tài khoản người dùng
answer | required | String phản hồi lời mời

<br>

## ***Tìm kiếm:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET | /event/search?query={`string`} | Tìm kiếm sự kiện theo tên | Một object chứa ID của sự kiện, tên sự kiện, mô tả, thời gian bắt đầu và kết thúc

### **Parameters**

Name | | Description
------|------|----
query | required | String nhập từ input phía client

<br>

## ***Xếp lịch:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET | /event/:`id`/sched | Lấy thông tin về thời gian của các khách mời để hiển thị bảng xếp lịch | Chi tiết cụ thể về từng khoảng thời gian có những ai bận, số lượng người có thể tham dự

### **Parameters**

Name | | Description
------|------|----
id | required| ID sự kiện

<br>

## ***Tài khoản:***

### **API**

Method | URL | Description |Return
-----|--------|-------|----------
GET |/my/info | Lấy thông tin tài khoản cá nhân | Thông tin tài khoản cá nhân.
POST |/my/change-password | Đổi mật khẩu | Trả về thông báo cập nhật mật khẩu thành công.
PUT |/my/info/update | Update thông tin cá nhân | Thông tin tài khoản vừa được cập nhật.
DELETE | /my | Xoá vĩnh viễn tài khoản cá nhân và các thông tin liên quan | Trả về thông báo xóa tài khoản thành công.
GET | /my/contacts | Gửi yêu cầu lấy danh sách liên lạc lên server | Trả về mảng danh sách cách object chứa tên, email, số điện thoại của người dùng trong danh sách liên lạc.
PUT | /my/contacts/update | Gửi thông tin liên lạc cần cập nhật lên server | Trả về kết quả cập nhật thành công.

<br>

# **JSON Response Data**
Ví dụ về một JSON response của Event:
```javascript
{
    _id: {"$oid":"619686618d1f69102b195295"},
    name: 'Họp đồ án CNPM',
    startTime: '2021-11-20T20:00:00.000+00:00',
    endTime: '2021-11-20T22:00:00.000+00:00',
    location: 'meet.google.com/gwr-rvkv-rao',
    description: 'Họp định kì hàng tuần, cập nhật tiến độ và phân chia công việc',
    option: {
        option: 5,
        title: 'Tùy chỉnh'
    },
    setting: {
        option: 0,
        title: 'Ngày'
    },
    endCondition: {
        option: 0,
        title: 'Không bao giờ'
    },
    guestIDs: ['619686618d1f69102b195295', '619686a78d1f69102b19529f']
}

```
Các fields trong một *JSON response của Event*:
- `_id`: ID của một sự kiện
- `name`: Tên của một sự kiện
- `startTime`: Ngày và thời gian bắt đầu sự kiện
- `endTime`: Ngày và thời gian kết thúc sự kiện
- `location`: Địa điểm diễn ra sự kiện
- `description`: Mô tả về sự kiện
- `option`: Tùy chọn chu kỳ lặp lại của sự kiện
- `setting`: Cài đặt tùy chọn cho chu kỳ lặp lại của sự kiện
- `endCondition`: Điều kiện dừng lặp của sự kiện
- `guestIDs`: Danh sách ID của các thành viên tham gia sự kiện
Ví dụ về một JSON response của User:
```javascript
{
    _id: {"$oid":"61952c497d33e6c7c825f51e"},
    username: 'phucvinh',
    fName: 'Vinh',
    lName: 'Nguyen',
    password: '$2a$08$aWQNX7jSww.n0d/dAjJEOuE20hR8skIYgeNQONAIr2gNXERxvXANe',
    email: 'phucvinh@gmail.com',
    phone: '0987987987',
    createdEvents: ['619686618d1f69102b195295'],
    joinedEvents: ['619686a78d1f69102b19529f'],
    contacts: ['61971c38b77d70fb47693a4d'],
    allowSched: 1
}
```
Các fields trong một *JSON response của User*:
- `_id`: ID của một người dùng
- `username`: Tên tài khoản của người dùng
- `fName`: Tên của người dùng
- `lName`: Họ của người dùng
- `password`: Mật khẩu của người dùng
- `email`: email của người dùng
- `phone`: Số điện thoại của người dùng
- `createdEvents`: Danh sách ID các sự kiện được tạo bởi người dùng
- `joinedEvents`: Danh sách ID các sự kiện người dùng tham dự
- `contacts`: Danh sách ID các liên lạc của người dùng
- `allowSched`: Cho phép người khác sử dụng lịch trình của mình để xếp lịch

Ví dụ về một JSON response của Invitation:
```javascript
{
    _id: {"$oid":"61951df97e03f771f66777fc"},
    hostId: {"$oid":"61951da4298aa2a1bf0150d4"},
    guestId: {"$oid":"61951dc5298aa2a1bf0150d5"},
    eventId: {"$oid":"61951dd8298aa2a1bf0150d6"},
    role: true
}
```
Các fields trong một *JSON response của Invitation*:
- `_id`: ID của một lời mời
- `hostID`: ID của người tổ chức sự kiện
- `guestID`: ID của người được mời tham dự sự kiện
- `eventID`: ID của sự kiện được tổ chức
- `role`: Quyền của người được mời đối với sự kiện ('Chỉ xem', 'Chỉnh sửa') 
