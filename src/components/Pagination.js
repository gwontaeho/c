"use client";

import { useState } from "react";

export const Pagination = ({ page = 1, perPage = 10, count = 0, range = 5, onChange }) => {
    const max = Math.ceil(count / perPage);
    let lis = [];
    for (let i = 0; i < max; i += range) lis.push(new Array(max).fill().slice(i, i + range));

    const [r, setR] = useState(Math.ceil(page / perPage) - 1);

    const handleClickPrev = () => {
        r > 0 && setR((prev) => prev - 1);
    };

    const handleClickNext = () => {
        r < lis.length - 1 && setR((prev) => prev + 1);
    };

    const className = "py-1.5 px-3 text-lg text-gray-600 disabled:text-gray-300";

    return (
        <ul className="flex space-x-1">
            <li>
                <button className={className} onClick={handleClickPrev} disabled={r === 0}>
                    &lt;
                </button>
            </li>
            {lis?.[r]?.map((_, i) => {
                const n = i + 1 + range * r;

                return (
                    <li key={`pagination-${r}-${i}`}>
                        <button className={className + (n === page ? " text-primary font-bold" : "")} onClick={() => onChange(n)}>
                            {n}
                        </button>
                    </li>
                );
            })}
            <li>
                <button className={className} onClick={handleClickNext} disabled={r === lis.length - 1}>
                    &gt;
                </button>
            </li>
        </ul>
    );
};
