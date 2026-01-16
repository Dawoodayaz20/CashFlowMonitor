import React from "react";
import { AreaChart, Area } from "recharts";

// data:any, key:number
const data = [
    {
        name: "John",
        income: 3000,
    },
    {
        name: "Alex",
        income: 4000,
    },
    {
        name: "Alex",
        income: 2000,
    },
    {
        name: "Alex",
        income: 1500,
    },
    {
        name: "Alex",
        income: 1800,
    },
    {
        name: "Alex",
        income: 1800,
    },
]

const AreaChartComp = (  ) => {

    return(
        <div>
            <AreaChart width={1000} height={300} data={data}>
                <Area dataKey="income" />
            </AreaChart>
        </div>
    )
}

export default AreaChartComp;
