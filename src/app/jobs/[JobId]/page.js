"use client";

import Link from "next/link";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Map } from "@/components";
import { getJob, getJobs } from "@/apis";
import { TIMES, WAGE_TYPES, WAGE_MIN } from "@/constants";

export default function Job() {
    const { JobId } = useParams();

    const { data = {}, isSuccess } = useQuery({ queryKey: ["job", JobId], queryFn: () => getJob(JobId) });
    const {
        id,
        title,
        content,
        days,
        begin,
        end,
        time,
        wage_type,
        wage,
        contact,
        sido,
        address,
        address_detailed,
        latitude,
        longitude,
        negotiable_days,
        negotiable_time,
        negotiable_wage,
        store_name,
        createdAt,
    } = data;

    const jobsQuery = useQuery({ queryKey: ["jobs", sido], queryFn: () => getJobs({ sido: sido, perPage: 16, page: 1 }), enabled: !!sido });
    const rows = jobsQuery.data?.rows || [];

    useEffect(() => {
        if (isSuccess) {
            let next_recent_jobs;
            const prev_recent_jobs = JSON.parse(localStorage.getItem("recent_jobs")) || [];
            next_recent_jobs = prev_recent_jobs.filter((v) => v.id !== id);
            next_recent_jobs = [{ id, store_name, title }, ...next_recent_jobs].slice(0, 5);
            localStorage.setItem("recent_jobs", JSON.stringify(next_recent_jobs));
        }
    }, [isSuccess, id, title, store_name]);

    if (!isSuccess) return null;

    return (
        <main className="px-8 py-20 space-y-40">
            <div className="space-y-8">
                <div className="px-8 flex items-end justify-between">
                    {/* <div className="text-3xl">{store_name}</div> */}
                    <div className="text-3xl">test</div>
                    <button className="text-xl" onClick={() => history.back()}>
                        목록으로
                    </button>
                </div>

                <div className="flex space-x-4 flex-1">
                    <div className="flex-1 space-y-4">
                        <div className="card p-8 space-y-4">
                            <div className="label">공고 제목</div>
                            <div className="text-lg p-2">{title}</div>
                        </div>
                        <div className="card p-8 space-y-4">
                            <div className="label">공고 내용</div>
                            <pre className="text-lg whitespace-pre-wrap p-2">{content}</pre>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1 space-y-4">
                                <div className="card p-8 space-y-4">
                                    <div className="label">근무 요일</div>
                                    <div className="text-lg p-2">{days}</div>
                                    {negotiable_days && <div className="info-message">· 요일 협의 가능</div>}
                                </div>

                                <div className="card p-8 space-y-4">
                                    <div className="flex spacec-x-4">
                                        <div className="flex-1 space-y-4">
                                            <div className="label">근무 시작</div>
                                            <div className="text-lg p-2">{TIMES.find(({ value }) => value === begin)?.label}</div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="label">근무 종료</div>
                                            <div className="text-lg p-2">{TIMES.find(({ value }) => value === end)?.label}</div>
                                        </div>
                                    </div>
                                    {negotiable_time ||
                                        (time > 0 && (
                                            <div className="space-y-2">
                                                {negotiable_time && <div className="info-message">· 시간 협의 가능</div>}
                                                {time > 0 && <div className="info-message">{`· 하루에 ${time}시간 근무`}</div>}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 flex flex-col">
                                <div className="card p-8 space-y-4">
                                    <div className="label">담당자 연락처</div>
                                    <div className="text-lg p-2">{contact}</div>
                                </div>
                                <div className="card p-8 space-y-4">
                                    <div className="label">급여</div>
                                    <div className="flex space-x-4 text-lg p-2">
                                        <div>{WAGE_TYPES.find(({ value }) => value === wage_type)?.label}</div>
                                        <div>{wage?.toLocaleString()}원</div>
                                        {wage_type === "H" &&
                                            wage !== WAGE_MIN &&
                                            (wage > WAGE_MIN ? (
                                                <div className="success-message">+{(wage - WAGE_MIN).toLocaleString()}</div>
                                            ) : (
                                                <div className="error-message">{(wage - WAGE_MIN).toLocaleString()}</div>
                                            ))}
                                    </div>
                                    <div className="space-y-2">
                                        {negotiable_wage && <div className="info-message">· 급여 협의 가능</div>}
                                        <div className="info-message">· 2023년 최저시급은 {WAGE_MIN.toLocaleString()}원 입니다</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="p-8 space-y-4">
                                <div className="label">근무지 주소</div>
                                <div className="text-lg p-2">
                                    {address} {address_detailed}
                                </div>
                            </div>
                            {!!latitude && !!longitude && (
                                <div className="h-96">
                                    <Map latitude={latitude} longitude={longitude} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="px-8 flex items-end justify-between">
                    <div className="text-3xl">{sido}지역 구인공고</div>
                    <button className="text-xl" onClick={() => history.back()}>
                        더보기
                    </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {rows.map((row) => {
                        const { id, title, store_name, sigungu, bname } = row;
                        return (
                            <Link key={`job-${id}`} href={`/jobs/${id}`}>
                                <div className="card flex flex-col p-8 space-y-4 h-60 transition hover:bg-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg">{store_name}</div>
                                    </div>
                                    <div className="label px-2 line-clamp-2">{title}</div>
                                    <div className="text-sm flex-1 justify-end flex flex-col items-end space-y-2">
                                        <div>
                                            {TIMES.find(({ value }) => value === begin)?.label} - {TIMES.find(({ value }) => value === end)?.label}
                                        </div>
                                        <div>{days.replaceAll(",", " ")}</div>
                                        <div>
                                            {sigungu} {bname}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
