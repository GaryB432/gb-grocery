call ng build -prod --sourcemaps false --delete-output-path true
robocopy dist ../gb-grocery-iis /MIR /XD .git
ping 127.0.0.1 -n 6 > nul
copy web.config ..\gb-grocery-iis /Y
pushd ..\gb-grocery-iis
git add .
git commit -m "new version"
git push azure master
popd
