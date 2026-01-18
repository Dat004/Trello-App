export const DEPTH_SPACE = 35;
export const AVATAR_WIDTH = 32;

// Tính toán các giá trị phụ thuộc
export const AVATAR_CENTER_ROOT = AVATAR_WIDTH / 2 - 1;

export const getLineCenter = (depth) => {
    const marginLeft = DEPTH_SPACE * depth;
    return AVATAR_CENTER_ROOT + marginLeft;
};
