<?php
// ini_set('date.timezone','Asia/Shanghai');
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

$text=$data['text'];
// 获取当前日期，格式为 YYYY-MM-DD
$today = date('Y-m-d');
// 获取当前时间，格式为 =HH:MM:SS
$now = '['.date('H:i:s').']';
//日志文件夹
$dir='D:\\server-log\\';
//日志文件完整路径
$logfile=$dir.$today.'.log';
//添加当前时间
$log=$now.$text."\n";
//打开·创建·追加文件
$file=fopen($logfile,'a');
//写入日志
fwrite($file,$log);
