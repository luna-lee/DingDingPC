/*获取当前年的第几周，以及周对应的日期范围（根据当前日期的时间）
 *@author weiyongfu
 *@date 2017-11-17
 */
function getYearWeekRange(year, weekNum, nowDate) {
	var date = null;
	var year = year;
	var month = null;
	var day = null;
	var d = null;
	if(weekNum == null || weekNum == "") {
		if(nowDate != null && nowDate != "") {
			date = new Date(nowDate); //获取系统时间
			year = date.getFullYear(); //年
			month = date.getMonth() + 1; //月
			day = date.getDate(); //
			d = year + "-" + month + "-" + day;
		}
		else {
			//如果为空，默认加载当前日期，否则加载选择的周数
			date = new Date(); //获取系统时间
			year = date.getFullYear(); //年
			month = date.getMonth() + 1; //月
			day = date.getDate(); //
			d = year + "-" + month + "-" + day;
		}
	}
	else {
		if(weekNum.length == 3) {
			weekNum = weekNum.substring(1, 2);
		}
		else if(weekNum.length == 4) {
			weekNum = weekNum.substring(1, 3);
		}
		var weekDay = getDayEveryDay(year, weekNum);
		d = weekDay[0]; //获取对应周数的第一天
	}
	//获取当前日期的为今年的第几周的周数，常规的获取直接调用getWeekNumber(year, month, day);
	/*由于项目需要，我这儿的周定义为周五到下周四为一周,所以我传入的日期参数得往前推4天，
	 *然后在调用常规的计算周数的方法
	 */
	var beforeFourDay = GetDateStr(0, d); //当前日期前推4天的日期,返回值格式为2017-01-01
	var yearMonthDay = beforeFourDay.split("-");
	if(weekNum == null || weekNum == "") { //如果为空，默认加载当前日期的周数以及对应范围,否未为选择的周数
		weekNum = getWeekNumber(yearMonthDay[0], yearMonthDay[1], yearMonthDay[2]); //按照周五到下周四为一周，计算当前日期为今年的第几周
	}
	else {
		weekNum = weekNum;
	}
	//获取当前日期的为今年的第几周的周数日期范围，getDateRange("2017-01-01")，在调用常规的计算周数日期的方法返回值为["2016-12-26","2017-1-1"];
	/*由于项目需要，我这儿的周定义为周五到下周四为一周,
	 *在调用常规的计算周数日期的方法返回值时得相应做出调整getDateRange("2017-01-01");return ["2016-12-26","2017-1-1"];
	 * arr[0]前推3天，arr[1]后推5天,["2016-12-30","2017-1-5"],得出2017年的1月1馹,(按照周五到下周四算一周为一周的日期范围为["2016-12-30","2017-1-5"])
	 */
	var weekRange = getDateRange(beforeFourDay); //常规的传入时间返回周的范围(周一到周天) return 格式["2016-12-26","2017-1-1"]
	weekRange[0] = GetDateStr(0, weekRange[0]); //后推4天
	weekRange[1] = GetDateStr(0, weekRange[1]); //后推4天
	//返回当前日期为[年，周数，周的范围start,周的范围end],按照周五到下周四为一周
	return [year, weekNum, weekRange[0], weekRange[1]];
}
/*
 *这个方法是获取周对应的日期范围(常规的一周为周一到周天为一周
 * 参数datevalue如：2017-01-01)
 */
function getDateRange(datevalue) {
	var dateValue = datevalue;
	var arr = dateValue.split("-")
	//月份-1 因为月份从0开始 构造一个Date对象
	var date = new Date(arr[0], arr[1] - 1, arr[2]);
	var dateOfWeek = date.getDay(); //返回当前日期的在当前周的某一天（0～6--周日到周一）
	var dateOfWeekInt = parseInt(dateOfWeek, 10); //转换为整型
	if(dateOfWeekInt == 0) { //如果是周日
		dateOfWeekInt = 7;
	}
	var aa = 7 - dateOfWeekInt; //当前于周末相差的天数
	var temp2 = parseInt(arr[2], 10); //按10进制转换，以免遇到08和09的时候转换成0
	var sunDay = temp2 + aa; //当前日期的周日的日期
	var monDay = sunDay - 6 //当前日期的周一的日期
	var startDate = new Date(arr[0], arr[1] - 1, monDay);
	var endDate = new Date(arr[0], arr[1] - 1, sunDay);
	var sm = parseInt(startDate.getMonth()) + 1; //月份+1 因为月份从0开始
	var em = parseInt(endDate.getMonth()) + 1;
	//  alert("星期一的日期："+startDate.getFullYear()+"-"+sm+"-"+startDate.getDate());
	//  alert("星期日的日期："+endDate.getFullYear()+"-"+em+"-"+endDate.getDate());
	var start = startDate.getFullYear() + "-" + sm + "-" + startDate.getDate();
	var end = endDate.getFullYear() + "-" + em + "-" + endDate.getDate();
	var result = new Array();
	result.push(start);
	result.push(end);
	return result;
}
//以下几个函数是判断当前日期所对应的周数，如2017-1-1，为2017年第一周,return 1
/**
 2  * 判断年份是否为润年
 3  *
 4  * @param {Number} year
 5  */
function isLeapYear(year) {
	return(year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
/**
 10  * 获取某一年份的某一月份的天数
 11  *
 12  * @param {Number} year
 13  * @param {Number} month
 14  */
function getMonthDays(year, month) {
	return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}
/**
 27  * 获取某年的某天是第几周
 28  * @param {Number} y
 29  * @param {Number} m
 30  * @param {Number} d
 31  * @returns {Number}
 32  */
function getWeekNumber(y, m, d) {
	var now = new Date(y, m - 1, d),
		year = now.getFullYear(),
		month = now.getMonth(),
		days = now.getDate();
	//那一天是那一年中的第多少天
	for(var i = 0; i < month; i++) {
		days += getMonthDays(year, i);
	}
	//那一年第一天是星期几
	var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
	//	console.log(yearFirstDay)
	var week = null;
	if(yearFirstDay == 1) {
		week = Math.ceil(days / 7) + 1;
	}
	else {
		days -= (7 - yearFirstDay + 1);
		week = Math.ceil(days / 7) + 1;
	}
	return week-1;
} //计算周的范围结束
/*
 *js获取当前指定的前几天的日期,往前推4天，GetDateStr(4)，后推4天GetDateStr(-4)
 */
function GetDateStr(AddDayCount, date) {
	var dd = new Date(date);
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
	var y = dd.getFullYear();
	var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
	var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
	return y + "-" + m + "-" + d;
}
/*
 *传入年，周数，获取周数对应的所有日期
 */
var getDayEveryDay = function(year, index) {
	var d = new Date(year, 0, 1);
	while(d.getDay() != 1) {
		d.setDate(d.getDate() + 1);
	}
	var to = new Date(year + 1, 0, 1);
	var i = 1;
	var arr = [];
	for(var from = d; from < to;) {
		if(i == index) {
			arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + (from.getDate() - 1));
		}
		var j = 6;
		while(j > 0) {
			from.setDate(from.getDate() + 1);
			if(i == index) {
				arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + (from.getDate() - 1));
			}
			j--;
		}
		if(i == index) {
			return arr;
		}
		from.setDate(from.getDate() + 1);
		i++;
	}
}

function getLastDay(y, m) {
	var dt = new Date(y, m, 1);
	return new Date(dt.getTime() - 1000 * 60 * 60 * 24)
	//	alert(cdt.getFullYear() + "年" + (Number(cdt.getMonth()) + 1) + "月的最后一天是:" + cdt.getDate() + "日");
}

function timeAreaDays(faultDate, completeTime) {
	var stime = Date.parse(new Date(faultDate));
	var etime = Date.parse(new Date(completeTime));
	var usedTime = etime - stime; //两个时间戳相差的毫秒数
	var days = Math.floor(usedTime / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	var time = days + "天" + hours + "时" + minutes + "分";
	return days;
}

function timeAreaMonth(begin, end) {
	//默认格式为"20030303",根据自己需要改格式和方法
	var year1 = begin.split("-")[0];
	var year2 = end.split("-")[0];
	var month1 = begin.split("-")[1];
	var month2 = end.split("-")[1];
	var len = (year2 - year1) * 12 + (month2 - month1);
	return len;
}
export default {
	getYearWeekRange,
	getDateRange,
	getWeekNumber,
	getDayEveryDay,
	getLastDay,
	timeAreaDays,
	timeAreaMonth
}