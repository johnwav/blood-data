<template>
    <div class="wrapper">
        {{ bloodData.people.person_1.name }}
        <highcharts :options="chartOptions"></highcharts>
    </div>
</template>

<script>
import { Chart } from 'highcharts-vue'

//The component imports the Chart component from highcharts-vue, which is used to display the chart. It also imports data from a data.json file.

import data from "../data.json"

export default {
    name: "Body",
    components: {
        highcharts: Chart
        //
    },
    methods: {
        groupData(ageRange) {
            //The groupData method is used to group the people based on their blood groups and return the number of people in each group. The computed properties childrenData, youthData, and elderData use this method to group the people based on their age ranges and return the data for the corresponding age groups.
            const A = ageRange.filter(child => {
                return child.blood_group == 'A'
            })

            const B = ageRange.filter(child => {
                return child.blood_group == 'B'
            })

            const AB = ageRange.filter(child => {
                return child.blood_group == 'AB'
            })
            const O = ageRange.filter(child => {
                return child.blood_group == 'O'
            })
            return [A.length, B.length, AB.length, O.length]
        }
    },
    data() {
        return {
            bloodData: data,
            //The chartOptions object contains the configuration options for the Highcharts chart. The series array initially contains three empty data sets, one for each age group.
            chartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Bar Chart',
                    align: 'center'
                },

                xAxis: {
                    categories: ['A', 'B', 'AB', 'O'],
                    title: {
                        text: 'Blood Groups'
                    },
                },
                yAxis: {
                    min: 0,
                    allowDecimals: false,
                    title: {
                        text: 'Number of patients',
                    },
                    labels: {
                        overflow: 'justify'
                    },

                },
                tooltip: {


                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -40,
                    y: 80,
                    floating: true,
                    borderWidth: 1,
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Children',
                    data: []
                }, {
                    name: 'Youths',
                    data: []
                }, {
                    name: 'Elders',
                    data: []
                },
                ]
            }

        }
    },
    computed: {
        childrenData() {
            const children = Object.values(this.bloodData?.people).filter(child => child.age < 15)
            return this.groupData(children)
        },
        youthData() {
            const youths = Object.values(this.bloodData?.people).filter(youth => youth.age > 15 && youth.age < 65)
            return this.groupData(youths)
        },
        elderData() {
            const elders = Object.values(this.bloodData?.people).filter(elder => elder.age > 65)
            return this.groupData(elders)
        }
    },
    watch: {
        childrenData(newValue) {
            this.chartOptions.series[0].data = newValue;
        },
        youthData(newValue) {
            this.chartOptions.series[1].data = newValue;
        },
        elderData(newValue) {
            this.chartOptions.series[2].data = newValue;
        }
    },
    mounted() {
        this.chartOptions.series[0].data = this.childrenData;
        this.chartOptions.series[1].data = this.youthData;
        this.chartOptions.series[2].data = this.elderData;
    }
}
</script>