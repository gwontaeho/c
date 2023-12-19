"use client";

import { useForm } from "react-hook-form";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useMutation } from "@tanstack/react-query";

import { createJob } from "@/apis";
import { WAGE_TYPES, DAYS, TIMES, WAGE_MIN } from "@/constants";

export default function Regist() {
    const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({ mode: "onBlur", defaultValues: { title: "", content: "", begin: 0, end: 0 } });

    const [title, content, begin, end] = watch(["title", "content", "begin", "end"]);
    const time = begin <= end ? end - begin : 24 + (end - begin);

    const { mutate } = useMutation({ mutationFn: createJob, onSuccess: (data) => console.log(data) });

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";
        if (data.addressType === "R") {
            if (data.bname !== "") extraAddress += data.bname;
            if (data.buildingName !== "") extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        if (window.kakao) {
            kakao.maps.load(() => {
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(fullAddress, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        setValue("longitude", Number(result[0].x));
                        setValue("latitude", Number(result[0].y));
                    }
                });
            });
        }

        setValue("address", fullAddress);
        setValue("sido", data.sido);
        setValue("sigungu", data.sigungu);
        setValue("bname", data.bname);
        clearErrors("address");
    };

    const onSubmit = (data) => {
        const { days } = data;
        const variables = { ...data, time, days: days.toString() };
        console.log(variables);

        mutate(variables);
    };

    return (
        <main className="p-10 space-y-40">
            <div className="space-y-8">
                <div className="flex items-end space-x-4">
                    <div className="text-3xl font-medium">공고등록</div>
                </div>
                <form className="flex space-x-4 flex-1" onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="flex-[1.2] space-y-4">
                        <div aria-invalid={!!errors.title} className="card p-8 space-y-4">
                            <div className="label">공고 제목</div>
                            <div className="p-2 space-y-2">
                                <input {...register("title", { required: true, minLength: 5, maxLength: 50 })} className="input" maxLength={50} />
                                <div className="text-xs text-gray-400 text-right">{title.length || 0}/50</div>
                            </div>
                            {errors.title && <div className="error-message">제목을 5자 이상 입력해주세요</div>}
                        </div>

                        <div aria-invalid={!!errors.content} className="card p-8 space-y-4">
                            <div className="label">공고 내용</div>
                            <div className="flex flex-col p-2 space-y-2">
                                <textarea
                                    {...register("content", { required: true, minLength: 10, maxLength: 1000 })}
                                    className="input py-4 h-96 resize-none"
                                    maxLength={1000}
                                />
                                <div className="text-xs text-gray-400 text-right">{content.length || 0}/1000</div>
                            </div>
                            {errors.content && <div className="error-message">내용을 10자 이상 입력해주세요</div>}
                        </div>
                    </fieldset>
                    <fieldset className="flex-1 space-y-4">
                        <div aria-invalid={!!errors.days} className="card p-8 space-y-4">
                            <div className="label">근무 요일</div>
                            <div className="flex justify-between p-2">
                                {DAYS.map((day) => {
                                    return (
                                        <label key={`day-${day}`} className="flex items-center space-x-1">
                                            <div>{day}</div>
                                            <input {...register("days", { required: "근무 요일을 하나 이상 선택해주세요" })} value={day} type="checkbox" />
                                        </label>
                                    );
                                })}
                            </div>
                            <label className="flex items-center space-x-1">
                                <div>요일 협의 가능</div>
                                <input {...register("negotiable_days")} type="checkbox" />
                            </label>
                            {errors.days && <div className="error-message">{errors.days.message}</div>}
                        </div>
                        <div className="card p-8 space-y-4">
                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-4">
                                    <div className="label">근무 시작</div>
                                    <div className="p-2">
                                        <select {...register("begin", { valueAsNumber: true })} className="input">
                                            {TIMES.map(({ label, value }) => {
                                                return (
                                                    <option key={`begin-${value}`} value={value}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="label">근무 종료</div>
                                    <div className="p-2">
                                        <select {...register("end", { valueAsNumber: true })} className="input">
                                            {TIMES.map(({ label, value }) => {
                                                return (
                                                    <option key={`end-${value}`} value={value}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <label className="flex items-center space-x-2">
                                <div>시간 협의 가능</div>
                                <input {...register("negotiable_time")} type="checkbox" />
                            </label>
                            {time > 0 && <div className="info-message">{`· 하루에 ${time}시간 근무`}</div>}
                        </div>
                        <div aria-invalid={!!errors.wage} className="card p-8 space-y-4">
                            <div className="label">급여</div>
                            <div className="flex space-x-4 p-2">
                                <select {...register("wage_type")} className="input w-fit">
                                    {WAGE_TYPES.map(({ label, value }) => (
                                        <option key={`wage_type-${value}`} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    {...register("wage", {
                                        required: "급여를 입력해주세요",
                                        maxLength: 7,
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "급여는 숫자만 입력가능합니다",
                                        },
                                    })}
                                    className="input"
                                    maxLength={7}
                                />
                            </div>
                            <label className="flex items-center space-x-2">
                                <div>급여 협의 가능</div>
                                <input {...register("negotiable_wage")} type="checkbox" />
                            </label>
                            <div className="info-message">· 2023년 최저시급은 {WAGE_MIN.toLocaleString()}원 입니다</div>
                            {errors.wage && <div className="error-message">{errors.wage.message}</div>}
                        </div>
                    </fieldset>
                    <fieldset className="flex-1 space-y-4 flex flex-col">
                        <div aria-invalid={!!errors.store_name} className="card p-8 space-y-4">
                            <div className="label">매장 이름</div>
                            <div className="p-2">
                                <input {...register("store_name", { required: "매장 이름을 입력해주세요", maxLength: 20 })} className="input" maxLength={20} />
                            </div>
                            {errors.store_name && <div className="error-message">{errors.store_name.message}</div>}
                        </div>
                        <div aria-invalid={!!errors.contact} className="card p-8 space-y-4">
                            <div className="label">담당자 연락처</div>
                            <div className="p-2">
                                <input
                                    {...register("contact", {
                                        required: "담당자 연락처를 입력해주세요",
                                        maxLength: 20,
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: "연락처는 숫자만 입력가능합니다",
                                        },
                                    })}
                                    type="tel"
                                    className="input"
                                    maxLength={20}
                                />
                            </div>

                            {errors.contact && <div className="error-message">{errors.contact.message}</div>}
                        </div>
                        <div aria-invalid={!!errors.address} className="card p-8 space-y-4">
                            <div className="label">근무지 주소</div>
                            <div className="p-2 space-y-4">
                                <input
                                    {...register("address", { required: "근무지 주소를 입력해주세요" })}
                                    className="input cursor-pointer"
                                    readOnly
                                    onClick={() => open({ onComplete: handleComplete })}
                                />
                                <input {...register("address_detailed")} className="input" />
                            </div>
                            {errors.address && <div className="error-message">{errors.address.message}</div>}
                        </div>
                        <div className="flex flex-col flex-1 justify-end space-y-4">
                            {/* <button className="h-12 bg-white border rounded w-full shadow">불러오기</button> */}
                            <button className="h-12 bg-white border rounded w-full shadow">등록하기</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </main>
    );
}
