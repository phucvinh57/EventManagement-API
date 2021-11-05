const event = [{
  name: 'Cao Thanh Binh',
  date: '17/12/2001',
  time: '11:00',
  location: 'link',
  description: 'ok',
  cycle: {
    option: [0, 1, 2, 3, 4, 5], // chỉ chọn 1
    setting: {
      freq: 1,
      freqType: ['Ngày', 'Tuần', 'Tháng', 'Năm'], // chỉ chọn 1
      // Ngày: ---
      // Tuần: [CN, T2, ... T7]
      // Tháng: [Hàng tháng vào ngày {today.day}, Hàng tháng vào thứ {hôm nay} đầu tiên]
      // Năm: ---
      endCondition: [0, 1, 2]
      // 0: Không bao giờ
      // 1: Vào ngày {date}
      // 2: Sau {n} lần xuất hiện
    }
  }
}]

const user = [{
  accountName: 'abc',
  fName: 'binh',
  lName: 'cao',
  password: '1234',
  phone: '122333434',
  email: 'bin@gmail',
  events: [0, 1, 2, 3]
}]

const invite = [{
  hostId: 1,
  guestId: 2,
  eventId: 3
}]