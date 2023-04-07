<template>
    <div class="wrapper">
        <highcharts v-if="loaded" :options="chartOptions"></highcharts>
        <PulseLoader v-if="!loaded" :color="color" :size="size" :margin="margin"></PulseLoader>
        <div class="info" v-if="loaded">
            The bar chart displays the distribution of people across different blood groups and age ranges.
            <br>
            <br>
            The age ranges are :
            <br>
            <strong>Children:</strong> Less than 15 years.
            <br>
            <strong>Youths:</strong> 15 years through 65 years.
            <br>
            <strong>Elders: </strong> 65 years or older
            <br>
            <br>
            The bars of the chart indicate the number of people in each blood group, with the height of each bar
            representing the total number of individuals in that group. The bar for each age group is further divided into
            sub-bars, with each sub-bar representing the number of individuals in that age group and blood group.
        </div>
        <p class="info" v-if="!loaded">Loading Chart Please Wait....</p>
    </div>
</template>

<script>
import { Chart } from 'highcharts-vue'
import { doc, getDoc } from "firebase/firestore"
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import db from '../firebase/init'
import data from '../data.json'


//The component imports the Chart component from highcharts-vue, which is used to display the chart. It also imports data from a data.json file.


export default {
    name: "Body",
    components: {
        highcharts: Chart,
        PulseLoader
    },
    data() {
        return {
            color: '#FF6866',
            size: '50px',
            margin: '100px',
            bloodData: data,
            loaded: false,
            //The chartOptions object contains the configuration options for the Highcharts chart.
            // The series array initially contains three empty data sets, one for each age group.
            chartOptions: {
                update: {},
                chart: {
                    type: 'bar'
                },
                title: {
                    text: null,
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
                    x: -10,
                    y: 200,
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
     async created() {
        this.loaded = false;
        const bloodData = await localStorage.getItem('Data');
        if (bloodData) {

            this.bloodData = JSON.parse(bloodData);
            this.loaded = true;
        } else {

            // Retrieve the data from Firestore and store it in local storage
            getDoc(doc(db, 'people', 'KIddlUaVfJu2BtvXdSAV'))
                .then(docSnap => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        this.bloodData = data;
                        this.loaded = true;
                        localStorage.setItem('Data', JSON.stringify(data));
                    } else {
                        alert('Document does not exist')
                    }
                })
                .catch(error => {
                    console.error(error)
                })
        }

    },

    methods: {
        groupData(ageRange) {
            //The groupData method is used to group the people based on their blood groups and return the number of people in each group.
            //The computed properties childrenData, youthData, and elderData use this method to group the people
            //based on their age ranges and return the data for the corresponding age groups.
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
    computed: {
        childrenData() {
            if (this.bloodData.people != null) {
                const children = Object.values(this.bloodData?.people).filter(child => child.age < 15)
                return this.groupData(children)
            }

        },
        youthData() {
            if (this.bloodData.people != null) {
                const youths = Object.values(this.bloodData?.people).filter(youth => youth.age > 15 && youth.age < 65)
                return this.groupData(youths)
            }
        },
        elderData() {
            if (this.bloodData.people != null) {
                const elders = Object.values(this.bloodData?.people).filter(elder => elder.age > 65)
                return this.groupData(elders)
            }
        }
    },
    watch: {
        childrenData(newValue) {
            if (this.loaded) {
                this.chartOptions.series[0].data = newValue;
            }
        },
        youthData(newValue) {
            if (this.loaded) {
                this.chartOptions.series[1].data = newValue;
            }
        },
        elderData(newValue) {
            if (this.loaded) {
                this.chartOptions.series[2].data = newValue;
            }
        },

    },
    mounted() {
        if (this.loaded) {
            this.chartOptions.series[0].data = this.childrenData;
            this.chartOptions.series[1].data = this.youthData;
            this.chartOptions.series[2].data = this.elderData;
        }


    }
}
</script>