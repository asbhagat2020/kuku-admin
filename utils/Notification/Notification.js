import { notification } from 'antd';


export const showSuccessNotification = (title, description, duration = 3000) => {
    notification.success({
        message: title,
        description,
        duration: duration / 1000, 
    });
};

export const showErrorNotification = (title, description, duration = 3000) => {
    notification.error({
        message: title,
        description,
        duration: duration / 1000, 
    });
};

export const showWarningNotification = (title, description, duration = 3000) => {
    notification.warning({
        message: title,
        description,
        duration: duration / 1000,
    });
};