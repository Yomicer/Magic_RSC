// 创建两个 HashMap 来跟踪每个机器的最后使用时间和计数器
let lastUseTimes = new java.util.HashMap();
let machineTickCounters = new java.util.HashMap(); // 用于存储每个机器的独立计数器
//====================================================================================================================
var SpawnEntitytick = 15;            //机器预热时间     数值x2=描述   例如 2tick = 1second

var SpawnEntityms = 7500;           //斩杀间隔,单位毫秒   如30000ms=30s

var NeedperSpawnerCharge = 4096;         //每次击杀生物耗电

var radius = 8;                    //设置检测范围大小      如16,以自身为中心,33格边长的立方体内的数量

var NeedperCraftCharge = 64;            //每秒耗电      默认去除


//====================================================================================================================

function tick(info) {
    var machine = info.machine();
    var location = info.block().getLocation();
    var world = location.getWorld();

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

    if (NowCharge < NeedperCraftCharge) {
        //电量不足
        return;
    }

    machine.removeCharge(location, NeedperCraftCharge);

    const currentTime = new Date().getTime();

    // 获取该位置对应的最后使用时间，如果不存在则初始化为0
    let lastUseTime = lastUseTimes.getOrDefault(location, 0);

    if (currentTime - lastUseTime > SpawnEntityms) {

        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${radius} 格范围内有 ${numWitherSkeletons} 只凋零骷髅。`);        //测试
        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${radius} 格范围内有 ${numLivingEntities} 只生物。`);     //测试


        if (NowCharge < NeedperSpawnerCharge) {
            // org.bukkit.Bukkit.broadcastMessage("电量不足，无法生成!");      //测试
            lastUseTimes.put(location, currentTime);        //重置计时  防止卡机器
            return;
        }

        if (!world) {
            console.error("无效的位置世界");
            return;
        }

        // 获取半径范围内的所有实体
        // let entities = world.getNearbyEntities(location, radius, radius, radius);

        // 随机选择一个在线玩家作为伤害来源
        // let player = getRandomOnlinePlayer();

        //选择半径50格内的其中一个玩家

        let radius2 = 50;

        let player = getRandomPlayerInRadius(location, radius2);


        // org.bukkit.Bukkit.broadcastMessage("player:"+ player);


        if (!player) {
            // org.bukkit.Bukkit.broadcastMessage("附近没有玩家");
            lastUseTimes.put(location, currentTime);
            return;
        }


        // org.bukkit.Bukkit.broadcastMessage(`§7[系统] §f在 ${radius} 格范围内有 ${entities} 只生物。`);     //测试
        // 遍历所有实体并应用伤害

        // // 过滤出非玩家的 LivingEntity 实体
        // let livingEntities = entities.filter(entity => 
        //     entity instanceof org.bukkit.entity.LivingEntity && !(entity instanceof org.bukkit.entity.Player)
        // );
        // for (let i = 0; i < livingEntities.length; i++) {
        //     let entity = livingEntities[i];
        //     // org.bukkit.Bukkit.broadcastMessage("生物为:"+ entity);     //测试
        //     applyDamage(entity, player);
        // }

        explodeAtPlayerLocation(player, 4.0, false, false, location, world); // 创建一次爆炸，强度为4.0，不引起火焰，破坏方块，来源为玩家

        // let success = applyAreaDamage(world, location, player);



        machine.removeCharge(location, NeedperSpawnerCharge);
        lastUseTimes.put(location, currentTime);


    }
}

const explodeAtPlayerLocation = (player, power, setFire, breakBlocks, location, world) => {
    // 在玩家位置创建爆炸，指定爆炸强度、是否引起火焰、是否破坏方块，并将玩家作为爆炸源。
    world.createExplosion(location, power, setFire, breakBlocks, player);
}

// ★ 核心优化：批量伤害方法
function applyAreaDamage(world, center, player) {
    const DAMAGE = 100;
    let success = false;
    let config = getAddonConfig();
    let entitiesDamaged = 0;
    let maxEntitiesToDamageStr = config.getString("options.magic.kill-amount");

    // 尝试将字符串转换为整数
    let maxEntitiesToDamage = parseInt(maxEntitiesToDamageStr, 10);

    // 校验转换后的值是否为有效整数，并且大于0
    if (isNaN(maxEntitiesToDamage) || !Number.isInteger(maxEntitiesToDamage) || maxEntitiesToDamage <= 0) {
        // console.error("配置项 'options.magic.kill-amount' 必须是一个大于0的整数。当前设置: " + maxEntitiesToDamageStr);
        // 使用默认值或其他处理方式
        maxEntitiesToDamage = 5; // 示例：如果验证失败，使用默认值5
    } else {
        // console.log("最大伤害数量设置为: " + maxEntitiesToDamage);
    }

    // 获取附近的实体并转换为列表
    let nearbyEntities = world.getNearbyEntities(center, radius, radius, radius);



    let filteredEntities = [];
    for (let entity of nearbyEntities) {
        if (entity instanceof org.bukkit.entity.LivingEntity &&
            !(entity instanceof org.bukkit.entity.Player) &&
            entity.isValid() &&
            !entity.isDead()) {
            filteredEntities.push(entity);
            if (filteredEntities.length >= maxEntitiesToDamage) break;
        }
    }
    // org.bukkit.Bukkit.broadcastMessage("filteredEntities:" + filteredEntities);

    // 遍历过滤后的实体列表，最多处理5个实体
    for (let i = 0; i < filteredEntities.length; i++) {
        let entity = filteredEntities[i];
        entitiesDamaged++;
        // org.bukkit.Bukkit.broadcastMessage("处理的个数为:" + entitiesDamaged);
        entity.damage(DAMAGE, player);
        success = true; // 只要有一个实体被处理就标记成功
    }
    // runAsync(() => {
    //     for (let i = 0; i < filteredEntities.length; i++) {
    //     let entity = filteredEntities[i];
    //     org.bukkit.Bukkit.broadcastMessage("处理的个数为:"+ entitiesDamaged); 
    //     entity.damage(DAMAGE, player);
    // }
    // });

    return success;
}



function onPlace(event) {
    var player = event.getPlayer();
    // sendMessage(player, "方块被放置");

    // 当机器被放置时，清空该位置的最后使用时间和计数器记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);


}

function onBreak(event, itemStack, drops) {
    var player = event.getPlayer();
    // sendMessage(player, "方块被破坏");

    // 当机器被破坏时，从映射中移除它的最后使用时间记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min)) + min;
}


// 获取所有在线玩家并随机选择一个
// function getRandomOnlinePlayer() {
//     let players = org.bukkit.Bukkit.getOnlinePlayers();
//     if (players.size() === 0) {
//         return null;
//     }
//     let randomIndex = Math.floor(Math.random() * players.size());
//     return players.toArray()[randomIndex];
// }

function getRandomPlayerInRadius(center, radius) {
    // 获取中心点所在的世界中的所有玩家
    let players = org.bukkit.Bukkit.getOnlinePlayers().toArray();
    let playersInRadius = [];

    for (let player of players) {
        // 计算玩家与中心点之间的距离
        if (center.getWorld() === player.getWorld() && center.distance(player.getLocation()) <= radius) {
            playersInRadius.push(player);
        }
    }

    // 如果没有找到任何玩家，返回null
    if (playersInRadius.length === 0) {
        return null;
    }

    // 随机选择一个玩家并返回
    let randomIndex = Math.floor(Math.random() * playersInRadius.length);
    return playersInRadius[randomIndex];
}


// 对生物应用伤害
function applyDamage(entity, player) {
    const DAMAGE_AMOUNT = 100; // 伤害值（半心为单位）


    // let player = getRandomOnlinePlayer();


    // player.sendMessage("你呗选中了"+ player);
    entity.damage(DAMAGE_AMOUNT, player); // 对生物造成伤害，并指定伤害来源为玩家

    // sendMessage(player, `§b成功击中并伤害了 ${entity.getName()}！`);
}