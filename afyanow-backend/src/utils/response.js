export const ok = (res, data, message = "Success", status = 200) => res.status(status).json({ success: true, message, data });
export const fail = (res, message, error, status = 400) => res.status(status).json({ success: false, message, error });
