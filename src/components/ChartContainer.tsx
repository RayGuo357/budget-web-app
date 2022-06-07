import React, { Component } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartDataset, ChartData } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

type Props = { ref: React.RefObject<any> }

type State = { data: {} }
// https://react-chartjs-2.js.org/components/

ChartJS.register(ArcElement, Tooltip, Legend);

class ChartContainer extends Component<Props, State> {
    state: State = {
        data: {
            labels: ['Income'],
            datasets: [
                {
                    label: '$ of Income',
                    data: [12],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }
    }

    updateChart(newData: {}): void {
        this.setState({
            data: newData
        })
    }

    render() {
        return (
            <div className="ChartContainer">
                <Doughnut data={this.state.data as ChartData<"doughnut", number[], unknown>} />
            </div>
        )
    }
}

export default ChartContainer