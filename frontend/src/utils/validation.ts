export const validateField = (value: string, type: VariableType, pattern?: string): string | null => {
  if (!value) {
    return 'Поле обязательно для заполнения';
  }

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Некорректный email адрес';
      }
      break;

    case 'phone':
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(value)) {
        return 'Некорректный номер телефона';
      }
      break;

    case 'date':
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Некорректная дата';
      }
      break;

    case 'number':
      if (isNaN(Number(value))) {
        return 'Введите числовое значение';
      }
      break;

    case 'text':
      if (pattern && !new RegExp(pattern).test(value)) {
        return 'Значение не соответствует формату';
      }
      break;
  }

  return null;
}; 