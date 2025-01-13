// 创建两个 HashMap 来跟踪每个机器的最后使用时间和计数器
let lastUseTimes = new java.util.HashMap();
let machineTickCounters = new java.util.HashMap(); // 用于存储每个机器的独立计数器
//====================================================================================================================
var SpawnEntitytick = 15;            //刷怪笼预热时间     数值x2=描述   例如 2tick = 1second

var SpawnEntityms = 15000;           //刷怪笼生成怪物间隔,单位毫秒   如30000ms=30s

var LatestSpawnEntity = Java.type('org.bukkit.entity.EntityType').WITHER_SKELETON;      //设置刷怪笼生物

var NeedperSpawnerCharge = 999999999;         //每次生成生物耗电

var XYDistance = 5;                 //生成怪物的范围   水平半径

var YDECREASEDistance = 0;              //生成怪物的范围，向下增加   正负

var YPLUSDistance = 1;                  //生成怪物的范围，向上增加   正负

var radius = 18;                    //设置检测范围大小      如16,以自身为中心,33格边长的立方体内的数量

var MaxEntity = 16;                 //设置范围内最大实体数量        如10,最多生成9只生物, 刷怪笼占用1个实体

var SpawnMaxEntity = 15;             //设置范围内当前刷怪笼生物上限

// var NeedperCraftCharge = 10;            //每秒耗电      默认去除


//====================================================================================================================

function tick(info) {
    var machine = info.machine();
    var location = info.block().getLocation();
    let world = location.getWorld();

    let block = info.block();
    // 检查放置的方块是否为刷怪笼，并设置其属性
    if (block.getType() === org.bukkit.Material.SPAWNER) {
        let spawner = block.getState();
        if (spawner instanceof org.bukkit.block.CreatureSpawner) {
            let entityType = org.bukkit.entity.EntityType.PIG; // 或者其他实体类型

            // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f验证执行。`);     //测试

            spawner.setSpawnedType(entityType);
            spawner.setMinSpawnDelay(800); // 设置最小延迟（例如200刻）
            spawner.setMaxSpawnDelay(800); // 设置最大延迟（例如800刻）
            spawner.setMaxNearbyEntities(0); // 设置附近实体的最大数量
            spawner.setRequiredPlayerRange(18); // 设置玩家范围要求
            spawner.setSpawnRange(0); // 设置生成范围
            spawner.setSpawnCount(0); // 设置每次生成的数量

            // 更新方块状态
            spawner.update(false, false);
        }
    }


    // 获取该机器的计数器，如果不存在则初始化为0
    let tickCounter = machineTickCounters.getOrDefault(location, 0);

    

    


    if (tickCounter < SpawnEntitytick) {
        // 更新该机器的计数器
        machineTickCounters.put(location, tickCounter + 1);

        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${tickCounter} 计数测试`);   //测试
        return;
    }
    

    let NowCharge = machine.getCharge(location);


    //每秒耗电，默认关闭

    // if (NowCharge < NeedperCraftCharge) {
    //     //电量不足
    //     return;
    // }

    // machine.removeCharge(location, NeedperCraftCharge);

    const currentTime = new Date().getTime();

    // 获取该位置对应的最后使用时间，如果不存在则初始化为0
    let lastUseTime = lastUseTimes.getOrDefault(location, 0);

    if (currentTime - lastUseTime > SpawnEntityms) {

        let numWitherSkeletons = countWitherSkeletonsInRange(world, location, radius);
        let numLivingEntities = countLivingEntitiesInRange(world, location, radius);
        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${radius} 格范围内有 ${numWitherSkeletons} 只凋零骷髅。`);        //测试
        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${radius} 格范围内有 ${numLivingEntities} 只生物。`);     //测试

        if (numLivingEntities >= MaxEntity) {
            // org.bukkit.Bukkit.broadcastMessage("周围生物达到"+ MaxEntity +"只，无法生成");       //测试
            lastUseTimes.put(location, currentTime);        //重置计时  防止卡机器
            return;
        }

        if (numWitherSkeletons >= SpawnMaxEntity) {
            // org.bukkit.Bukkit.broadcastMessage("周围凋零骷髅达到"+ SpawnMaxEntity +"只，无法生成");        //测试
            lastUseTimes.put(location, currentTime);        //重置计时  防止卡机器
            return;
        }
        if (NowCharge < NeedperSpawnerCharge) {
            // org.bukkit.Bukkit.broadcastMessage("电量不足，无法生成!");      //测试
            lastUseTimes.put(location, currentTime);        //重置计时  防止卡机器
            return;
        }
        machine.removeCharge(location, NeedperSpawnerCharge);
        lastUseTimes.put(location, currentTime);

        // 生成一个新位置，在原始位置的Y坐标上加1
        let randomNum1 = getRandomInt(-XYDistance, XYDistance);
        let randomNum2 = getRandomInt(YDECREASEDistance, YPLUSDistance);
        let spawnLocation = location.clone().add(randomNum1, randomNum2, randomNum1);

        // world.spawnEntity(spawnLocation, LatestSpawnEntity);
    }
}

function onPlace(event) {
    var player = event.getPlayer();
    // sendMessage(player, "方块被放置");

    

    // 当机器被放置时，清空该位置的最后使用时间和计数器记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);

    let block = event.getBlock();
    // 检查放置的方块是否为刷怪笼，并设置其属性
    if (block.getType() === org.bukkit.Material.SPAWNER) {
        let spawner = block.getState();
        if (spawner instanceof org.bukkit.block.CreatureSpawner) {
            let entityType = org.bukkit.entity.EntityType.WITHER_SKELETON; // 或者其他实体类型

            // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f验证执行。`);     //测试

            spawner.setSpawnedType(entityType);
            spawner.setMinSpawnDelay(800); // 设置最小延迟（例如200刻）
            spawner.setMaxSpawnDelay(800); // 设置最大延迟（例如800刻）
            spawner.setMaxNearbyEntities(0); // 设置附近实体的最大数量
            spawner.setRequiredPlayerRange(18); // 设置玩家范围要求
            spawner.setSpawnRange(0); // 设置生成范围
            spawner.setSpawnCount(0); // 设置每次生成的数量

            // 更新方块状态
            spawner.update(false, false);
        }
    }


}

function onBreak(event, itemStack, drops) {
    var player = event.getPlayer();
    // sendMessage(player, "方块被破坏");
    
    // 阻止方块掉落物品
    event.setDropItems(false);

    // 当机器被破坏时，从映射中移除它的最后使用时间记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);
}

function countWitherSkeletonsInRange(world, location, radius) {
    // 使用 getNearbyEntities 获取指定半径内的所有实体
    let entities = world.getNearbyEntities(location,radius, radius, radius);
    let count = 0;

    // 遍历这些实体并统计 WITHER_SKELETON 的数量
    for (let entity of entities) {
        if (entity.getType() === org.bukkit.entity.EntityType.WITHER_SKELETON) {
            count++;
        }
    }

    return count;
}

function countLivingEntitiesInRange(world, location, radius) {
    // 使用 world.getNearbyEntities 获取指定半径内的所有实体
    let entities = world.getNearbyEntities(location, radius, radius, radius);
    let count = 0;

    // 遍历这些实体并统计 LivingEntity 的数量
    for (let entity of entities) {
        if (entity instanceof org.bukkit.entity.LivingEntity && !(entity instanceof org.bukkit.entity.Player)) {
            count++;
        }
    }

    return count;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min)) + min;
}