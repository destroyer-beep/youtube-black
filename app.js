let tabActive = 0;
let tabActiveRevenue = 0;
let newData = [];
let editorData = [];
let period = '7'
let headerTab = 0;
const periodsBtn = document.querySelector('.content__header_periods');
const periodsTitle = periodsBtn.querySelector('.content__header_periods_value');
const body = document.querySelector('body');
const periodsItems = document.querySelectorAll('.content__header_periods_item');
const periodsBox = document.querySelector('.content__header_periods_list');
const myChart = echarts.init(document.getElementById('chart'));
const chartContent = document.querySelector('.charts__content');
const tabs = document.querySelectorAll('.charts__container_tab');
const tabsRevenue = document.querySelectorAll('.charts__container_tab_revenue');
const customBox = document.querySelector('.content__header_periods_custom');
const headerTabs = document.querySelectorAll('.content__header_nav_item_change');
const tab1 = document.querySelector('#views');
const tab2 = document.querySelector('#watch');
const tab3 = document.querySelector('#subscribe');
const tab4 = document.querySelector('#revenue');
const tab4Deviation = document.querySelector('.charts__container_tab_custom_deviation');
const deviationItems = document.querySelectorAll('.charts__container_tab_deviation');
const article = document.querySelector('.charts__article');
const periodsBoxValues = document.querySelector('.content__header_periods_data');
const editor = document.querySelector('.editor');
const marks = document.querySelectorAll('.charts__container_marks_item');

document.querySelector('.header__profile_create_btn').addEventListener('click', () => {
    editor.classList.add('editor__active');

    const title = document.querySelector('.charts__title_value').textContent;
    const editorTitle = document.querySelector('.editor__title');
    const editorValues = document.querySelector('.editor__values');
    const editorDataInput = document.querySelector('.editor__data');
    editorTitle.textContent = '';
    const titleInput = document.createElement('input')
    titleInput.type = 'text'
    titleInput.id = 'title';
    titleInput.value = title;
    editorTitle.append(titleInput);

    const indicators = editorData.indicators;
    editorValues.textContent = ''
    for(let indicator in indicators) {
        const titleInput = document.createElement('input')
        titleInput.type = 'text'
        titleInput.id = indicator;
        titleInput.classList.add('indicator');
        titleInput.value = indicators[indicator];
        editorValues.append(titleInput);
    }

    editorDataInput.textContent = ''

    newData.map((item, ind) => {
        const row = document.createElement('div')
        row.classList.add('row')
        const dtInput = document.createElement('input')
        dtInput.type = 'text'
        dtInput.classList.add('data');
        dtInput.value = item.dt;
        row.append(dtInput);
        const valueInput = document.createElement('input')
        valueInput.type = 'text'
        valueInput.classList.add('value');
        valueInput.value = item.value;
        row.append(valueInput);
        editorDataInput.append(row)
    })
})

document.querySelector('.editor__btn_close').addEventListener('click', () => {
    editor.classList.remove('editor__active');
})

document.querySelector('.editor__btn_save').addEventListener('click', () => {
    const emptyWidth = document.querySelector('.editor__width > input').value;
    document.querySelector('.bcg_empty').style.width = emptyWidth + 'px';
    const title = document.querySelector('.charts__title_value');
    title.textContent = document.querySelector('#title').value;
    const indicators = document.querySelectorAll('.indicator');
    let error = 0;
    indicators.forEach(item => {
        editorData.indicators[item.id] = item.value;
    })

    const rows = document.querySelectorAll('.row');

    if(headerTab === 0) {
        if(tabActive === 0) {
            editorData.views = [];
        } else if (tabActive === 1) {
            editorData.watch = [];
        } else if(tabActive === 2){
            editorData.subscribe = [];
        } else {
            editorData.revenue = [];
        }
    } else {
        editorData.subscribe = [];
    }

    rows.forEach(row => {
        if(isNaN(row.querySelector('.value').value)) {
            row.querySelector('.value').classList.add('input__error');
            error += 1;
        } else {
            row.querySelector('.value').classList.remove('input__error');
        }
        const dataObj = {
            value: row.querySelector('.value').value,
            dt: row.querySelector('.data').value
        }
        if(headerTab === 0) {
            if(tabActive === 0) {
                editorData.views.push(dataObj);
            } else if (tabActive === 1) {
                editorData.watch.push(dataObj);
            } else if(tabActive === 2){
                editorData.subscribe.push(dataObj);
            } else {
                editorData.revenue.push(dataObj);
            }
        } else {
            editorData.subscribe.push(dataObj);
        }
    })


    if(!error) {
        renderCharts(headerTab)
        editor.classList.remove('editor__active');
    }
})

headerTabs.forEach(item => {
    item.addEventListener('click', e => {
        if(e.currentTarget.textContent === 'Overview') {
            article.style.display = 'block';
            chartContent.style.width = '65%';
            myChart.resize()
            document.querySelectorAll('.charts__container_tab').forEach((item, ind) => {
                item.style.display = 'flex';
                if(ind == 0) {
                    item.classList.add('charts__container_tab_active');
                } else {
                    item.classList.remove('charts__container_tab_active');
                    item.classList.remove('charts__container_tab_custom_border');
                }
            })
            document.querySelector('.charts__title').style.display = 'flex';
            document.querySelector('.charts__container').style.marginTop = '40px';
            headerTab = 0;
        }
        else {
            tabActive = 0;
            article.style.display = 'none';
            chartContent.style.width = '100%';
            myChart.resize()
            document.querySelectorAll('.charts__container_tab').forEach(item => {
                if(!item.classList.contains('charts__container_tab_custom')) item.style.display = 'none';
                else {
                    item.classList.add('charts__container_tab_active');
                    item.classList.add('charts__container_tab_custom_border');
                }
            })
            document.querySelector('.charts__title').style.display = 'none';
            document.querySelector('.charts__container').style.marginTop = '40px';
            headerTab = 1;
        }
        headerTabs.forEach(elem => {
            if(elem === e.currentTarget) {
                elem.classList.add('content__header_nav_item_active')
            } else {
                elem.classList.remove('content__header_nav_item_active')
            }
        })
        renderCharts(headerTab)
    })
})

new AirDatepicker('.content__header_periods_custom_box', {
    locale: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
        dateFormat: 'MM/dd/yyyy',
        timeFormat: 'hh:mm aa',
        firstDay: 0
    },
    range: true,
    buttons: [
        {
            content() {
                return 'CANCEL'
            },
            onClick(dp) {
                periodsBox.classList.remove('content__header_periods_list_active');
                customBox.classList.remove('content__header_periods_custom_active');
            }
        },
        {
            content() {
                return 'APPLY'
            },
            onClick(dp) {
                periodsBox.classList.remove('content__header_periods_list_active');
                customBox.classList.remove('content__header_periods_custom_active');
                periodsTitle.textContent = 'Custom';
                period = 'custom'
                renderCharts(headerTab)
            }
        }
    ]
})
periodsBtn.addEventListener('click', e => {
    e.stopPropagation();
    if(e.target.classList.contains('content__header_periods') || e.target.classList.contains('content__header_periods_data') || e.target.classList.contains('content__header_periods_box') || e.target.classList.contains('content__header_periods_value')) periodsBox.classList.add('content__header_periods_list_active');
})

body.addEventListener('click', () => {
    periodsBox.classList.remove('content__header_periods_list_active');
    customBox.classList.remove('content__header_periods_custom_active');
})

periodsItems.forEach(item => {
    item.addEventListener('click', e => {
        e.stopPropagation();
        if(e.currentTarget.id !== 'custom') {
            periodsBox.classList.remove('content__header_periods_list_active');
            period = e.currentTarget.id;
            periodsTitle.textContent = e.currentTarget.textContent;
            renderCharts(headerTab)
        } else {
            customBox.classList.add('content__header_periods_custom_active');
        }
    })
})



tabs.forEach(tab => {
    tab.addEventListener('click', e => {
        tabs.forEach((item, index) => {
            if(item !== e.currentTarget) {
                item.classList.remove('charts__container_tab_active');
            } else {
                tabActive = index;
                item.classList.add('charts__container_tab_active');
            }
        })
        renderCharts(headerTab)
    })
})

tabsRevenue.forEach(tab => {
    tab.addEventListener('click', e => {
        tabsRevenue.forEach((item, index) => {
            if(item !== e.currentTarget) {
                item.classList.remove('charts__container_tab_active');
            } else {
                tabActiveRevenue = index;
                item.classList.add('charts__container_tab_active');
            }
        })
        renderCharts(headerTab)
    })
})

document.querySelectorAll('.charts__container_marks_item').forEach(item => {
    item.addEventListener('click', e => {
        if(e.target.style.opacity === '0') {
            e.target.style.opacity = 1;
        } else {
            e.target.style.opacity = 0;
        }
    })
})

function setIndicators(data) {
    editorData = data;
    if(headerTab === 0) {
        deviationItems.forEach(item => {
            item.classList.remove('charts__container_tab_deviation_visible');
        })
        const {views, watch, subscribe, revenue} = data.indicators
        tab1.parentNode.querySelector('p').textContent = 'Views';
        tab2.parentNode.querySelector('p').textContent = 'Watch time (hours)';
        tab3.parentNode.querySelector('p').textContent = 'Subscribers';
        tab1.textContent = views;
        tab2.textContent = watch;
        tab3.textContent = '+' + subscribe;
        tab4.textContent = '$' + revenue.toLocaleString('en-IN');
        tab4Deviation.style.display = 'none';
    } else {
        const {revenue, revenueDeviation} = data.indicators
        tab4.textContent = '$' + revenue.toLocaleString('en-IN');
        tab4Deviation.style.display = 'block';
        tab4Deviation.textContent = '$' + revenueDeviation.toLocaleString('en-IN') + ' more than usual';
    }

}
const renderCharts = (headerTab) => {
    myChart.clear();
    if(headerTab === 0) {
        document.querySelector('.bcg_empty').style.display = 'none';
        marks.forEach(item => {
            item.style.display = 'flex';
        })
        setIndicators(data[period]);
        if(tabActive === 0) {
            newData = data[period].views;
        } else if (tabActive === 1) {
            newData = data[period].watch;
        } else if(tabActive === 2){
            newData = data[period].subscribe;
        } else {
            newData = data[period].revenue;
        }
        let xAxis = [];
        newData.map(item => {
            if(!xAxis.includes(item.dt)) xAxis.push(item.dt);
        });
        periodsBoxValues.textContent = newData[0].dt + ' - ' + newData[newData.length - 1].dt
        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: (cfg) => {
                    cfg = cfg[0]
                    const value = cfg.value.toLocaleString('en-IN')
                    return `<div style="background: #282828;">
                       <div style="color: #FFF;">${cfg.axisValue}</div>
                        <div style="margin-top: 10px; font-size: 20px; font-weight: 400; color: rgb(47, 165, 203)">$ ${value}</div>
                    </div>`
                },
                backgroundColor: '#282828'
            },
            grid: {
                left: '4%',
                right: '9%'
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 40,
                    showMaxLabel: true,
                    showMinLabel: true,
                    color: '#aaa'
                },
            },
            yAxis: {
                type: 'value',
                position: 'right',
                axisLabel: {
                    color: '#aaa'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(170, 170, 170, 0.3)'
                    }
                }
            },
            series: [
                {
                    areaStyle: {
                        color: 'rgba(47, 165, 203, 0.1)'
                    },
                    itemStyle: {
                        color: 'rgb(47, 165, 203)',
                    },
                    showSymbol: false,
                    data: newData,
                    type: 'line',
                    smooth: false
                }
            ]
        };
        myChart.setOption(option);
    } else {
        marks.forEach(item => {
            item.style.display = 'none';
        })
        document.querySelector('.bcg_empty').style.display = 'block';
        setIndicators(revenue[period]);
        newData = revenue[period].subscribe
        let xAxis = [];
        newData.map(item => {
            if(!xAxis.includes(item.dt)) xAxis.push(item.dt);
        });
        periodsBoxValues.textContent = newData[0].dt + ' - ' + newData[newData.length - 1].dt
        const option = {
            tooltip: {
                trigger: 'axis',
                formatter: (cfg) => {
                    cfg = cfg[0]
                    const value = cfg.value.toLocaleString('en-IN')
                    return `<div style="background: #282828;">
                       <div style="color: #fff;">${cfg.axisValue}</div>
                        <div style="margin-top: 10px; font-size: 20px; font-weight: 400; color: rgb(82, 176, 161)">$ ${value}</div>
                    </div>`
                },
                backgroundColor: '#282828'
            },
            grid: {
                left: '4%',
                right: '9%'
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                boundaryGap: false,
                axisTick: {
                    show: true
                },
                axisLabel: {
                    showMaxLabel: true,
                    showMinLabel: true,
                    color: '#aaa'
                },
            },
            yAxis: {
                type: 'value',
                position: 'right',
                axisLabel: {
                    formatter: '$ {value}.00',
                    color: '#aaa'
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(170, 170, 170, 0.3)'
                    }
                }
            },
            series: [
                {
                    areaStyle: {
                        color: 'rgba(82, 176, 161, 0.1)'
                    },
                    itemStyle: {
                        color: 'rgb(82, 176, 161)',
                    },
                    showSymbol: false,
                    data: newData,
                    type: 'line',
                    smooth: false
                }
            ]
        };
        myChart.setOption(option);
    }
}

renderCharts(headerTab)
