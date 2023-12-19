"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const Recent = () => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "visible";
    }, [open]);

    useEffect(() => {
        const recent_jobs = JSON.parse(localStorage.getItem("recent_jobs"));
        setRecent(recent_jobs);
    }, [open]);

    const handleClickJob = (id, store_name, title) => {
        router.push(`/jobs/${id}`);
        setOpen(false);

        let next_recent_jobs;
        const prev_recent_jobs = JSON.parse(localStorage.getItem("recent_jobs")) || [];
        next_recent_jobs = prev_recent_jobs.filter((v) => v.id !== id);
        next_recent_jobs = [{ id, store_name, title }, ...next_recent_jobs].slice(0, 5);
        localStorage.setItem("recent_jobs", JSON.stringify(next_recent_jobs));
    };

    return (
        <>
            <button onClick={() => setOpen(true)}>최근 본 공고</button>
            {open &&
                createPortal(
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30" onClick={() => setOpen(false)}>
                        <div className="card w-[400px] p-8 space-y-8" onClick={(e) => e.stopPropagation()}>
                            <div className="text-xl">최근 본 공고</div>
                            <ul>
                                {recent.map(({ id, title, store_name }) => {
                                    return (
                                        <li
                                            key={`recent-job-${id}`}
                                            className="flex p-4 items-center justify-between rounded-lg hover:bg-gray-100"
                                            onClick={() => handleClickJob(id, store_name, title)}
                                        >
                                            <div>
                                                <div>{store_name}</div>
                                                <div className="label text-sm px-2">{title}</div>
                                            </div>
                                            <button className="material-symbols-outlined">remove</button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export const Header = () => {
    const pathname = usePathname();

    const handleClickSignin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code&state=${pathname}`;
    };

    return (
        <header className="h-40 w-full px-8 flex items-center justify-between">
            <Link href="/">
                <i className="text-5xl font-thin">CAFEGUGU</i>
            </Link>
            <div className="flex-1 flex justify-end space-x-8 mr-20 text-xl">
                <Link href="/jobs">지역별 구인 공고</Link>
                <Recent />
            </div>
            <button onClick={handleClickSignin} className="text-xl">
                로그인
            </button>
        </header>
    );
};
