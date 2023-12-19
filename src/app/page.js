"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/apis";

import { TIMES } from "@/constants";

export default function Home() {
    const sido = "";
    const perPage = 7;
    const page = 1;

    const { data = {} } = useQuery({
        queryKey: ["jobs", sido, perPage, page],
        queryFn: () => getJobs({ sido, perPage, page }),
    });

    const { rows = [] } = data;

    console.log(data);

    // return (
    //     <main className="px-4 py-20 space-y-40">
    //         <div className="space-y-8">
    //             <div className="flex items-end px-8 space-x-4">
    //                 {/* <div className="text-3xl font-medium">방금 등록된 구인공고</div> */}
    //                 <div className="text-3xl font-medium">F</div>
    //             </div>
    //             <div className="grid grid-cols-1">
    //                 {rows.map((row) => {
    //                     const { id, title, store_name, days, begin, end, sido: s, sigungu, bname } = row;
    //                     return (
    //                         <Link key={`job-${id}`} href={`/jobs/${id}`} className="first:border-t border-b">
    //                             <div className="flex flex-col p-4 space-y-2 transition hover:bg-gray-100">
    //                                 <div className="flex items-center justify-between">
    //                                     <div className="text-lg">{store_name}</div>
    //                                 </div>
    //                                 <div className="label px-2">{title}</div>
    //                                 <div className="text-sm flex-1 justify-end flex flex-col items-end space-y-1">
    //                                     <div>
    //                                         {TIMES.find(({ value }) => value === begin)?.label} - {TIMES.find(({ value }) => value === end)?.label}
    //                                     </div>
    //                                     <div>{days.replaceAll(",", " ")}</div>
    //                                     <div>{`${!sido ? s : ""} ${sigungu} ${bname}`}</div>
    //                                 </div>
    //                             </div>
    //                         </Link>
    //                     );
    //                 })}
    //             </div>
    //         </div>
    //     </main>
    // );

    return (
        <main className="px-8 py-20 space-y-40">
            <div className="space-y-8">
                <div className="flex items-end px-8 space-x-4">
                    {/* <div className="text-3xl font-medium">방금 등록된 구인공고</div> */}
                    <div className="text-3xl font-medium">F</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {rows.map((row) => {
                        const { id, title, store_name, days, begin, end, sido: s, sigungu, bname } = row;
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
                                        <div>{`${!sido ? s : ""} ${sigungu} ${bname}`}</div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    <Link href={`/jobs`}>
                        <div className="flex items-center justify-center h-60 rounded-lg text-2xl transition hover:bg-gray-100">더보기</div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
