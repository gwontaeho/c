"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

import { Pagination } from "@/components";
import { SIDOS, TIMES } from "@/constants";
import { getJobs } from "@/apis";

export default function Jobs() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const perPage = 16;

    const sido = SIDOS.find(({ value }) => value === searchParams.get("sido"))?.value || "";
    const page = Number(searchParams.get("page")) || 1;

    const { data = {} } = useQuery({
        queryKey: ["jobs", sido, perPage, page],
        queryFn: () => getJobs({ sido, perPage, page }),
    });
    const { count = 0, rows = [] } = data;

    const handleChangeSido = (e) => {
        const query = !!e.target.value ? `?sido=${e.target.value}` : "";
        router.push(`/jobs${query}`);
    };

    const handleChangePage = (v) => {
        const query = !!sido ? `?sido=${sido}&page=${v}` : `?page=${v}`;
        router.push(`/jobs${query}`);
    };

    return (
        <main className="px-8 pb-40 space-y-40">
            <div className="flex flex-col items-center">
                <select className="card input text-center text-xl w-96 h-14" value={sido} onChange={handleChangeSido}>
                    {SIDOS.map(({ label, value }) => (
                        <option key={`sido-${value}`} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="space-y-8">
                <div className="flex items-end px-8 space-x-4">
                    {/* <div className="text-3xl font-medium">{sido || "전 "}지역 카페 구인공고</div> */}
                    <div className="text-3xl font-medium">TEST</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {rows.map((row) => {
                        const { id, title, store_name, days, begin, end, sido: s, sigungu, bname } = row;
                        return (
                            <Link key={`job-${id}`} href={`/jobs/${id}`}>
                                <div className="card flex flex-col p-8 space-y-4 h-64 transition hover:bg-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="text-lg">{store_name}</div>
                                    </div>
                                    <div className="label px-2 line-clamp-2">{title}</div>
                                    <div className="text-sm flex-1 justify-end flex flex-col items-end space-y-1">
                                        <div>
                                            {TIMES.find(({ value }) => value === begin)?.label} - {TIMES.find(({ value }) => value === end)?.label}
                                        </div>
                                        <div>{days.replaceAll(",", " ")}</div>
                                        <div>{`${!sido ? s : ""} ${sigungu} ${bname}`}</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {count > 0 && (
                    <div className="flex justify-center">
                        <Pagination perPage={20} count={count} page={page} onChange={handleChangePage} />
                    </div>
                )}
            </div>
        </main>
    );
}
