function tick(info) {
    var machine = info.machine();
    var location = info.block().getLocation();

    machine.removeCharge(location, 2147483647);


}