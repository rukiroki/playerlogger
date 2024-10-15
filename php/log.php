<?php
$filepath = "D:\\server-log\\";
if (isset($_GET['file'])){
    $filename = urldecode($_GET['file']);
    $file = $filepath.$filename;
    $text = file_get_contents($file);
    $lines = explode("\n", $text);
    if(isset($_GET['search'])){
        $querystr=urldecode($_GET['search']);
        echo "搜索关键词[". $querystr. "]<br>";
        $query = explode(" ",$querystr);
        foreach ($lines as $line) {

            foreach($query as $q){
                $q = "/".$q."/";
                if(!preg_match($q,$line)){
                    $line =0;
                }
            }
            if($line !== 0){
                echo $line . "<br>";
            }
        }
        
    }else{
        foreach ($lines as $line) {
            echo $line . "<br>";
        }
    }
    
}else{
    $files = glob($filepath . '/*.log');
    foreach($files as $file){
        $filename = basename($file);
        echo "<a href=log.php?file=". urlencode($filename) . ">" . $filename . "</a><br>";
    }
}

?>
<?php
include 'include/log.html';
?>