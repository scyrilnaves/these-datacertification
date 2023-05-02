set terminal pngcairo nocrop enhanced font "verdana,8" size 640,400
set output "results_commit_rate_variation.eps"

set terminal postscript eps enhanced color font 'Times-Roman,20'

set title "Commit rate variance for 4 to 24 nodes"

set grid ytics lc rgb "black" lw 1.5 lt 0.1
set grid xtics lc rgb "black" lw 1.5 lt 0.1


set xlabel "Input transactions per second"
set ylabel "Commit Rate Variance"

set yrange [0 to 130]
set xrange [5 to 50]

set xtics nomirror
set ytics nomirror

set xtics (5, 10, 15, 20, 25, 30, 40, 50)
#set ytics 2
#set ytics (2000, 4000, 8000, 10000)

#set logscale y 10

set key left top
#set key right center

#csv settings:
set key autotitle columnhead
set datafile separator comma

plot "commit_rate_var_data.csv" using 1:2 with linespoints pt 2 pi 0 title "4 nodes", \
    "commit_rate_var_data.csv" using 1:3 with linespoints pt 4 pi 0 title "6 nodes", \
    "commit_rate_var_data.csv" using 1:4 with linespoints pt 6 pi 0 title "12 nodes", \
    "commit_rate_var_data.csv" using 1:5 with linespoints pt 10 pi 0 title "18 nodes", \
    "commit_rate_var_data.csv" using 1:6 with linespoints pt 12 pi 0 lt rgb "#000000" title "24 nodes"
