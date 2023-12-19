export const WAGE_TYPES = [
    { label: "시급", value: "H" },
    { label: "일급", value: "D" },
    { label: "월급", value: "M" },
];

export const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export const TIMES = Array(25)
    .fill(null)
    .flatMap((_, i) => [
        { label: `${i < 10 ? `0${i}` : i}:00`, value: i },
        { label: `${i < 10 ? `0${i}` : i}:30`, value: i + 0.5 },
    ])
    .slice(0, 49);

export const WAGE_MIN = 9620;

export const SIDOS = [
    {
        label: "지역을 검색해보세요",
        value: "",
    },
    {
        label: "서울",
        value: "서울",
    },

    {
        label: "부산",
        value: "부산",
    },

    {
        label: "대구",
        value: "대구",
    },
    {
        label: "인천",
        value: "인천",
    },
    {
        label: "광주",
        value: "광주",
    },
    {
        label: "대전",
        value: "대전",
    },
    {
        label: "울산",
        value: "울산",
    },
    {
        label: "세종",
        value: "세종",
    },
    {
        label: "경기",
        value: "경기",
    },
    {
        label: "강원",
        value: "강원",
    },
    {
        label: "충북",
        value: "충북",
    },
    {
        label: "충남",
        value: "충남",
    },
    {
        label: "전북",
        value: "전북",
    },
    {
        label: "전남",
        value: "전남",
    },
    {
        label: "경북",
        value: "경북",
    },
    {
        label: "경남",
        value: "경남",
    },
    {
        label: "제주",
        value: "제주",
    },
];
