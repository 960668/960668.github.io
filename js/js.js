const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");
const p4 = document.getElementById("p4");
const p5 = document.getElementById("p5");
const p6 = document.getElementById("p6");
const i1 = document.querySelector('.fulu11');
const i2 = document.querySelector('.fulu12');

// 初始化文本的函数
function initializeText(element) {
    const text = element.textContent;
    element.textContent = '';
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        element.appendChild(span);
    });
}

// 显示动画的函数
function animateText(element, delay = 150) {
    element.style.opacity = '1';
    const spans = element.querySelectorAll('span');
    
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('show');
        }, index * delay);
    });
}

// 初始化两个元素
initializeText(p5);
initializeText(p6);

p1.addEventListener('mouseover', function () {
    p2.classList.add('visible');
    p1.classList.add('enlarged');
    p4.classList.add('p4-hidden');
});

p1.addEventListener('mouseout', function () {
    p2.classList.remove('visible');
    p1.classList.remove('enlarged');
    p4.classList.remove('p4-hidden');
});

// 六爻起卦
const date = Lunar.fromDate(new Date());
const year_gz = date.getYearInGanZhi();
const month_gz = date.getMonthInGanZhi();
const day_gz = date.getDayInGanZhi();
const time_gz = date.getTimeInGanZhi();
console.log(year_gz);
console.log(month_gz);
console.log(day_gz);
console.log(time_gz);

const Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const XunKongMap = {
    "甲子": "戌亥",
    "甲戌": "申酉",
    "甲申": "午未",
    "甲午": "辰巳",
    "甲辰": "寅卯",
    "甲寅": "子丑"
};

function getXunKong(ganZhi) {
    const gan = ganZhi.substring(0, 1);
    const ganIndex = Gan.indexOf(gan);

    const xunStartGan = "甲";
    const xunStartZhi = Object.keys(XunKongMap).find(key => {
        const startGanZhi = key;
        const startZhi = startGanZhi.substring(1);
        const startZhiIndex = Zhi.indexOf(startZhi);
        const currentZhi = ganZhi.substring(1);
        const currentZhiIndex = Zhi.indexOf(currentZhi);

        let diff = ganIndex - Gan.indexOf(xunStartGan);
        if (diff < 0) diff += 10;
        return (currentZhiIndex - startZhiIndex + 12) % 12 === diff;
    });

    return XunKongMap[xunStartZhi];
}

const lunar = Lunar.fromDate(new Date());
const dayGanZhi = lunar.getDayInGanZhi();
const xunKong = getXunKong(dayGanZhi);
console.log(`旬空：${xunKong}`);

function generateSingleYao() {
    const random = Math.floor(Math.random() * 8);

    if (random === 0) return { type: 'yang', change: true };
    if (random === 1) return { type: 'yin', change: true };
    if (random === 3 || random === 5 || random === 7) return { type: 'yang', change: false };
    return { type: 'yin', change: false };
}

function generateGua() {
    const originalGua = [];
    for (let i = 0; i < 6; i++) {
        originalGua.push(generateSingleYao());
    }

    const changedGua = originalGua.map(yao => {
        if (yao.change) {
            return { type: yao.type === 'yin' ? 'yang' : 'yin', change: false };
        }
        return { ...yao };
    });

    console.log('本卦：');
    displayGua(originalGua);
    console.log('变卦：');
    displayGua(changedGua);

    return { originalGua, changedGua };
}

function displayGua(gua) {
    gua.reverse().forEach((yao, index) => {
        let display = yao.type === 'yang' ? '———' : '— —';
        if (yao.change) display += ' o';
        console.log(display);
    });
    gua.reverse();
}

document.addEventListener('DOMContentLoaded', function () {
    const p1 = document.getElementById('p1');
    const d2 = document.getElementById('d2');

    if (!p1 || !d2) {
        console.error('找不到必要的元素');
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        .gua-container {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-top: 50px;
        }

        .gua {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .gua-content {
            display: flex;
            flex-direction: column;
            gap: 25px;
            margin-top: 20px;
        }

        .row {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .liu-shen {
            width: 40px;
            color: white;
            text-align: right;
            opacity: 0;
            transition: opacity 0.5s ease;
            font-size: 16px;
        }

        .hexagram-name {
            color: white;
            font-size: 20px;
            text-align: center;
            margin: 15px 0;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .yao-line {
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .yao-content {
            width: 100px;
        }

        .yang-line {
            width: 100px;
            height: 3px;
            background-color: white;
        }

        .yin-line {
            width: 100px;
            display: flex;
            justify-content: space-between;
        }

        .yin-line span {
            width: 45px;
            height: 3px;
            background-color: white;
        }

        .change-marker {
            color: white;
            font-size: 16px;
            width: 20px;
            text-align: center;
        }

        .gua-title {
            color: white;
            font-size: 20px;
            margin-bottom: 10px;
        }

        .time-info {
            color: white;
            font-size: 18px;
            text-align: center;
            margin-bottom: 30px;
        }
    `;
    document.head.appendChild(style);

    function formatDateTime() {
        const date = Lunar.fromDate(new Date());
        return `${date.getYearInGanZhi()}年，${date.getMonthInGanZhi()}月，${date.getDayInGanZhi()}日，${date.getTimeInGanZhi()}时，旬空${getXunKong(date.getDayInGanZhi())}`;
    }

    function getDayGan() {
        const date = Lunar.fromDate(new Date());
        return date.getDayInGanZhi().substring(0, 1);
    }

    const hexagramData = {
        '111111': { name: '乾为天' },
        '000000': { name: '坤为地' },
        '010001': { name: '水雷屯' },
        '100010': { name: '山水蒙' },
        '010111': { name: '水天需' },
        '111010': { name: '天水讼' },
        '000010': { name: '地水师' },
        '010000': { name: '水地比' },
        '110111': { name: '风天小畜' },
        '111011': { name: '天泽履' },
        '000111': { name: '地天泰' },
        '111000': { name: '天地否' },
        '111101': { name: '天火同人' },
        '101111': { name: '火天大有' },
        '000100': { name: '地山谦' },
        '001000': { name: '雷地豫' },
        '011001': { name: '泽雷随' },
        '100110': { name: '山风蛊' },
        '000011': { name: '地泽临' },
        '110000': { name: '风地观' },
        '101001': { name: '火雷噬嗑' },
        '100101': { name: '山火贲' },
        '100000': { name: '山地剥' },
        '000001': { name: '地雷复' },
        '111001': { name: '天雷无妄' },
        '100111': { name: '山天大畜' },
        '100001': { name: '山雷颐' },
        '011110': { name: '泽风大过' },
        '010010': { name: '坎为水' },
        '101101': { name: '离为火' },
        '011100': { name: '泽山咸' },
        '001110': { name: '雷风恒' },
        '111100': { name: '天山遁' },
        '001111': { name: '雷天大壮' },
        '101000': { name: '火地晋' },
        '000101': { name: '地火明夷' },
        '101011': { name: '火泽睽' },
        '110101': { name: '风火家人' },
        '010100': { name: '水山蹇' },
        '001010': { name: '雷水解' },
        '100011': { name: '山泽损' },
        '110001': { name: '风雷益' },
        '011111': { name: '泽天夬' },
        '111110': { name: '天风姤' },
        '000110': { name: '地风升' },
        '011000': { name: '泽地萃' },
        '010110': { name: '水风井' },
        '011010': { name: '泽水困' },
        '101110': { name: '火风鼎' },
        '011101': { name: '泽火革' },
        '100100': { name: '震为雷' },
        '001001': { name: '艮为山' },
        '110100': { name: '风山渐' },
        '001011': { name: '雷泽归妹' },
        '001101': { name: '雷火丰' },
        '101100': { name: '火山旅' },
        '110110': { name: '风泽中孚' },
        '011011': { name: '兑为泽' },
        '110010': { name: '风水涣' },
        '010011': { name: '水泽节' },
        '110011': { name: '风泽中孚' },
        '001100': { name: '雷山小过' },
        '101010': { name: '火水未济' },
        '010101': { name: '水火既济' }
    };

    function getHexagramBinary(gua) {
        return gua.map(yao => yao.type === 'yang' ? '1' : '0').join('');
    }

    function getHexagramName(gua) {
        const binaryString = getHexagramBinary(gua);
        return hexagramData[binaryString]?.name || '未知卦象';
    }

    // 六神数组
const liuShen = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];

// 根据日干获取六神顺序
function getLiuShenOrder(dayGan) {
    const orders = {
        '甲': [0, 1, 2, 3, 4, 5],
        '乙': [0, 1, 2, 3, 4, 5],
        '丙': [1, 2, 3, 4, 5, 0],
        '丁': [1, 2, 3, 4, 5, 0],
        '戊': [2, 3, 4, 5, 0, 1],
        '己': [3, 4, 5, 0, 1, 2],
        '庚': [4, 5, 0, 1, 2, 3],
        '辛': [4, 5, 0, 1, 2, 3],
        '壬': [5, 0, 1, 2, 3, 4],
        '癸': [5, 0, 1, 2, 3, 4]
    };

    const order = orders[dayGan];
    return order.map(index => liuShen[index]);
}

// 获取当日天干
function getDayGan() {
    const date = Lunar.fromDate(new Date());
    return date.getDayInGanZhi().substring(0, 1);
}

function createGua(gua, title) {
    const guaDiv = document.createElement('div');
    guaDiv.className = 'gua';
    
    const titleDiv = document.createElement('div');
    titleDiv.textContent = title;
    titleDiv.style.color = 'white';
    guaDiv.appendChild(titleDiv);
    
    const hexagramName = getHexagramName(gua);
    const nameDiv = document.createElement('div');
    nameDiv.className = 'hexagram-name';
    nameDiv.textContent = hexagramName;
    nameDiv.style.opacity = '0';
    guaDiv.appendChild(nameDiv);
    
    const dayGan = getDayGan();
    const orderedLiuShen = getLiuShenOrder(dayGan).reverse();
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'gua-content';
    guaDiv.appendChild(contentDiv);
    
    gua.forEach((yao, index) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
        if (title === '本卦') {
            const liuShenDiv = document.createElement('div');
            liuShenDiv.className = 'liu-shen';
            liuShenDiv.textContent = orderedLiuShen[index];
            liuShenDiv.style.opacity = '0';
            rowDiv.appendChild(liuShenDiv);
        } else {
            const spacer = document.createElement('div');
            spacer.className = 'liu-shen';
            rowDiv.appendChild(spacer);
        }
        
        const yaoDiv = document.createElement('div');
        yaoDiv.className = 'yao-line';
        
        const yaoContent = document.createElement('div');
        yaoContent.className = 'yao-content';
        
        if (yao.type === 'yang') {
            const yangLine = document.createElement('div');
            yangLine.className = 'yang-line';
            yaoContent.appendChild(yangLine);
        } else {
            const yinLine = document.createElement('div');
            yinLine.className = 'yin-line';
            yinLine.innerHTML = '<span></span><span></span>';
            yaoContent.appendChild(yinLine);
        }
        
        yaoDiv.appendChild(yaoContent);
        
        if (yao.change) {
            const marker = document.createElement('div');
            marker.className = 'change-marker';
            marker.textContent = '○';
            yaoDiv.appendChild(marker);
        } else {
            const spacer = document.createElement('div');
            spacer.className = 'change-marker';
            yaoDiv.appendChild(spacer);
        }
        
        rowDiv.appendChild(yaoDiv);
        contentDiv.appendChild(rowDiv);
        
        setTimeout(() => {
            if (index === 0) {
                nameDiv.style.opacity = '1';
            }
            if (title === '本卦') {
                rowDiv.querySelector('.liu-shen').style.opacity = '1';
            }
            yaoDiv.style.opacity = '1';
        }, index * 300);
    });
    
    return guaDiv;
}

    function displayGuaResult(originalGua, changedGua) {
        const guaContainer = document.createElement('div');
        guaContainer.className = 'gua-container';

        guaContainer.appendChild(createGua(originalGua, '本卦'));
        guaContainer.appendChild(createGua(changedGua, '变卦'));

        return guaContainer;
    }

    function writeText(text, callback) {
        d2.innerHTML = '';
        d2.style.padding = '20px';
        
        const textContainer = document.createElement('div');
        textContainer.className = 'time-info';
        d2.appendChild(textContainer);

        const chars = text.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.transition = 'opacity 0.5s';
            span.style.display = 'inline-block';
            textContainer.appendChild(span);

            setTimeout(() => {
                span.style.opacity = '1';
                if (index === chars.length - 1 && callback) {
                    setTimeout(callback, 500);
                }
            }, index * 200);
        });
    }

    p1.addEventListener('click', function () {
        const dateTimeInfo = formatDateTime();
        const { originalGua, changedGua } = generateGua();
        p1.style.display = 'none'; // 点击后隐藏 p1
        p4.style.display = 'none'; // 点击后隐藏 p4
        p3.style.display = 'block'; // 显示 p3
        i1.style.transition = 'opacity 2s ease'; // 添加过渡效果
        i1.style.opacity = '0.2'; // 设置新的透明度
        i2.style.transition = 'opacity 2s ease'; // 添加过渡效果
        i2.style.opacity = '0.2'; // 设置新的透明度

    // 先显示p5
    animateText(p6, 150);
    
    // 等p6显示完后再显示p5
    setTimeout(() => {
        animateText(p5, 150);
    }, p6.textContent.length * 150 + 500); // 等待p6显示完毕后再开始显示p6
        

        

        writeText(dateTimeInfo, () => {
            setTimeout(() => {
                d2.appendChild(displayGuaResult(originalGua, changedGua));
            }, 1000);
        });
    });
});