import React, { Component } from 'react'
import '../css/ChartContainer.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartDataset, ChartData } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { DataType } from '../helper/helper'

type Props = { ref: React.RefObject<any> }

type State = { data: DataType, incomeLabels: Map<string, number>, expensesLabels: Map<string, number> }
// https://react-chartjs-2.js.org/components/

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.color = "#DDDDDD";

class ChartContainer extends Component<Props, State> {
    state: State = {
        data: {
            labels: [],
            datasets: [
                {
                    label: '$ of Income',
                    data: [],
                    backgroundColor: [
                        'rgba(114, 114, 115, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(114, 114, 115, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                },
            ],
        },
        incomeLabels: new Map<string, number>(),
        expensesLabels: new Map<string, number>()
    }

    updateChart(newData: DataType, incomeMap: Map<string, number>, expensesMap: Map<string, number>): void {
        this.setState({
            data: newData,
            incomeLabels: incomeMap,
            expensesLabels: expensesMap
        })
    }

    render() {
        return (
            <div className="ChartContainer">
                <Doughnut data={this.state.data as ChartData<"doughnut", number[], unknown>} />
                <div className='LegendContainer'>
                    <div className='Legend AvailableLegend'>
                        <div>{this.state.data.labels[0]}:</div>
                        <div>${this.state.data.datasets[0].data[0]}</div>
                    </div>
                    <div className='Legend IncomeLegend'>
                        Income
                    </div>
                    {
                        Array.from(this.state.incomeLabels).map(([key, val]) => {
                            return (<div key={key} className='Legend'>
                                <div>{key}:</div>
                                <div>${val}</div>
                            </div>)
                        })
                    }
                    <div className='Legend ExpenseLegend'>
                        Expenses
                    </div>
                    {
                        Array.from(this.state.expensesLabels).map(([key, val]) => {
                            return (<div key={key} className='Legend'>
                                <div>{key}:</div>
                                <div>${val}</div>
                            </div>)
                        })
                    }
                </div>
            </div>
        )
    }
}

export default ChartContainer