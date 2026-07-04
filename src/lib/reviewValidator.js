export function validateReview(data) {
  const errors = {};
  const name = (data.name || '').trim();
  if (name.length < 2 || name.length > 100) {
    errors.name = 'Имя: 2-100 символов';
  }
  if (!data.position) {
    errors.position = 'Выберите должность';
  }
  const city = (data.city || '').trim();
  if (city.length < 2 || city.length > 100) {
    errors.city = 'Город: 2-100 символов';
  }
  if (!data.stars || data.stars < 1 || data.stars > 5) {
    errors.stars = 'Поставьте оценку';
  }
  const text = (data.text || '').trim();
  if (text.length < 10 || text.length > 1000) {
    errors.text = 'Текст: 10-1000 символов';
  }
  if (!data.monthsInProgram || data.monthsInProgram < 1 || data.monthsInProgram > 12) {
    errors.monthsInProgram = 'Выберите срок';
  }
  if (!data.photo) {
    errors.photo = 'Загрузите фото';
  }
  return errors;
}

export function validatePhoto(file) {
  if (!file) return 'Выберите файл';
  if (!file.type.startsWith('image/')) return 'Только изображения';
  if (file.size > 5 * 1024 * 1024) return 'Макс 5MB';
  return null;
}