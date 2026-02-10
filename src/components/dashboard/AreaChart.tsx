import React from "react";
import { AreaChart, Area } from "recharts";

// data:any, key:number
const data = [
    {
        month: "Jan",
        income: 3000,
    },
    {
        month: "Feb",
        income: 4000,
    },
    {
        month: "March",
        income: 2000,
    },
    {
        month: "April",
        income: 1500,
    },
    {
        month: "May",
        income: 1800,
    },
    {
        month: "June",
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
