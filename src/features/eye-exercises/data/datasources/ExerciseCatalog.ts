import type { Exercise } from '../../domain/entities/Exercise';
export const EXERCISES: Exercise[] = [
 { id:'blink', title:'Chớp mắt chậm', subtitle:'Làm dịu cảm giác khô mắt', durationSeconds:30, category:'relax', emoji:'👁️', steps:['Chớp mắt chậm 10 lần','Nhắm mắt nhẹ trong 3 giây','Mở mắt và thư giãn'] },
 { id:'look-far', title:'Nhìn xa', subtitle:'Rời mắt khỏi màn hình', durationSeconds:20, category:'focus', emoji:'🏞️', steps:['Chọn một vật ở xa','Nhìn nhẹ nhàng, không nheo mắt','Thở chậm và thả lỏng vai'] },
 { id:'near-far', title:'Đổi tiêu điểm', subtitle:'Chuyển nhìn gần và xa', durationSeconds:40, category:'focus', emoji:'🎯', steps:['Nhìn ngón tay ở khoảng cách thoải mái','Chuyển nhìn ra vật ở xa','Lặp lại chậm rãi'] },
 { id:'palming', title:'Thư giãn mắt', subtitle:'Nghỉ ngắn, không tạo áp lực lên mắt', durationSeconds:45, category:'relax', emoji:'😌', steps:['Xoa ấm hai lòng bàn tay','Nhắm mắt nhẹ nhàng','Không ấn tay lên nhãn cầu'] },
 { id:'eye-scan', title:'Quan sát xung quanh', subtitle:'Di chuyển ánh nhìn nhẹ nhàng', durationSeconds:30, category:'strengthen', emoji:'🌿', steps:['Nhìn sang trái rồi về giữa','Nhìn sang phải rồi về giữa','Dừng nếu thấy khó chịu'] }
];
