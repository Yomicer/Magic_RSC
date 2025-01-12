// 创建两个 HashMap 来跟踪每个机器的最后使用时间和计数器
let lastUseTimes = new java.util.HashMap();
let machineTickCounters = new java.util.HashMap(); // 用于存储每个机器的独立计数器
//====================================================================================================================
// var SpawnEntitytick = 15;            //刷怪笼预热时间     数值x2=描述   例如 2tick = 1second

// var SpawnEntityms = 15000;           //刷怪笼生成怪物间隔,单位毫秒   如30000ms=30s

// var LatestSpawnEntity = Java.type('org.bukkit.entity.EntityType').CAT;      //设置刷怪笼生物

var NeedperSpawnerCharge = 520;         //每次生成生物耗电

var XYDistance = 5;                 //生成怪物的范围   水平半径

var YDECREASEDistance = 0;              //生成怪物的范围，向下增加   正负

var YPLUSDistance = 1;                  //生成怪物的范围，向上增加   正负

var radius = 18;                    //设置检测范围大小      如16,以自身为中心,33格边长的立方体内的数量

var MaxEntity = 17;                 //设置范围内最大实体数量        如10,最多生成9只生物, 刷怪笼占用1个实体

var SpawnMaxEntity = 15;             //设置范围内当前刷怪笼生物上限

// var NeedperCraftCharge = 10;            //每秒耗电      默认去除

const SPAWNER_TYPE = [
    { id: "MAGIC_SPAWNER_WITHER_SKELETON_1",LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITHER_SKELETON,SpawnEntitytick: 30,SpawnEntityms: 15000, speed: 1},
    { id: "MAGIC_SPAWNER_SKELETON_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SKELETON, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ZOMBIE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_CREEPER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CREEPER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ENDERMAN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMAN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_BLAZE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').BLAZE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_CAVE_SPIDER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAVE_SPIDER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_GHAST_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GHAST, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ENDERMITE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMITE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SILVERFISH_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SILVERFISH, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_IRON_GOLEM_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').IRON_GOLEM, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_GUARDIAN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GUARDIAN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SLIME_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SLIME, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_MAGMA_CUBE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MAGMA_CUBE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SPIDER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SPIDER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_WITCH_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITCH, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_CHICKEN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CHICKEN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_COW_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').COW, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SHEEP_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHEEP, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_HORSE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HORSE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_MUSHROOM_COW_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MUSHROOM_COW, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_CAT_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAT, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_OCELOT_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').OCELOT, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_PIG_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIG, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_RABBIT_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').RABBIT, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SQUID_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SQUID, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_GLOW_SQUID_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GLOW_SQUID, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_WOLF_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WOLF, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_VILLAGER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VILLAGER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ZOMBIE_VILLAGER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE_VILLAGER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_PIGLIN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_PIGLIN_BRUTE_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN_BRUTE, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ZOMBIFIED_PIGLIN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIFIED_PIGLIN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_DROWNED_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').DROWNED, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_HUSK_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HUSK, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_ELDER_GUARDIAN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ELDER_GUARDIAN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_PANDA_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PANDA, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_PHANTOM_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PHANTOM, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_POLAR_BEAR_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').POLAR_BEAR, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_SHULKER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHULKER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_STRAY_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').STRAY, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_WARDEN_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WARDEN, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_VINDICATOR_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VINDICATOR, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_EVOKER_1", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').EVOKER, SpawnEntitytick: 30, SpawnEntityms: 15000, speed: 1 },
    { id: "MAGIC_SPAWNER_WITHER_SKELETON_2",LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITHER_SKELETON,SpawnEntitytick: 20,SpawnEntityms: 10000, speed: 2},
    { id: "MAGIC_SPAWNER_SKELETON_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SKELETON, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ZOMBIE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_CREEPER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CREEPER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ENDERMAN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMAN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_BLAZE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').BLAZE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_CAVE_SPIDER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAVE_SPIDER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_GHAST_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GHAST, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ENDERMITE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMITE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SILVERFISH_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SILVERFISH, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_IRON_GOLEM_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').IRON_GOLEM, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_GUARDIAN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GUARDIAN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SLIME_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SLIME, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_MAGMA_CUBE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MAGMA_CUBE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SPIDER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SPIDER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_WITCH_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITCH, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_CHICKEN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CHICKEN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_COW_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').COW, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SHEEP_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHEEP, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_HORSE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HORSE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_MUSHROOM_COW_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MUSHROOM_COW, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_CAT_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAT, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_OCELOT_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').OCELOT, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_PIG_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIG, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_RABBIT_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').RABBIT, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SQUID_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SQUID, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_GLOW_SQUID_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GLOW_SQUID, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_WOLF_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WOLF, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_VILLAGER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VILLAGER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ZOMBIE_VILLAGER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE_VILLAGER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_PIGLIN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_PIGLIN_BRUTE_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN_BRUTE, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ZOMBIFIED_PIGLIN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIFIED_PIGLIN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_DROWNED_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').DROWNED, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_HUSK_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HUSK, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_ELDER_GUARDIAN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ELDER_GUARDIAN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_PANDA_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PANDA, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_PHANTOM_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PHANTOM, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_POLAR_BEAR_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').POLAR_BEAR, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_SHULKER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHULKER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_STRAY_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').STRAY, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_WARDEN_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WARDEN, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_VINDICATOR_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VINDICATOR, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_EVOKER_2", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').EVOKER, SpawnEntitytick: 20, SpawnEntityms: 10000, speed: 2 },
    { id: "MAGIC_SPAWNER_WITHER_SKELETON_3",LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITHER_SKELETON,SpawnEntitytick: 10,SpawnEntityms: 5000, speed: 3},
    { id: "MAGIC_SPAWNER_SKELETON_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SKELETON, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ZOMBIE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_CREEPER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CREEPER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ENDERMAN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMAN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_BLAZE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').BLAZE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_CAVE_SPIDER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAVE_SPIDER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_GHAST_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GHAST, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ENDERMITE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ENDERMITE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SILVERFISH_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SILVERFISH, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_IRON_GOLEM_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').IRON_GOLEM, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_GUARDIAN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GUARDIAN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SLIME_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SLIME, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_MAGMA_CUBE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MAGMA_CUBE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SPIDER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SPIDER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_WITCH_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WITCH, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_CHICKEN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CHICKEN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_COW_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').COW, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SHEEP_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHEEP, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_HORSE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HORSE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_MUSHROOM_COW_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').MUSHROOM_COW, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_CAT_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').CAT, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_OCELOT_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').OCELOT, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_PIG_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIG, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_RABBIT_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').RABBIT, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SQUID_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SQUID, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_GLOW_SQUID_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').GLOW_SQUID, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_WOLF_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WOLF, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_VILLAGER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VILLAGER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ZOMBIE_VILLAGER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIE_VILLAGER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_PIGLIN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_PIGLIN_BRUTE_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PIGLIN_BRUTE, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ZOMBIFIED_PIGLIN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ZOMBIFIED_PIGLIN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_DROWNED_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').DROWNED, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_HUSK_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').HUSK, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_ELDER_GUARDIAN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').ELDER_GUARDIAN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_PANDA_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PANDA, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_PHANTOM_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').PHANTOM, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_POLAR_BEAR_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').POLAR_BEAR, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_SHULKER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').SHULKER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_STRAY_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').STRAY, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_WARDEN_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').WARDEN, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_VINDICATOR_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').VINDICATOR, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },
    { id: "MAGIC_SPAWNER_EVOKER_3", LatestSpawnEntity: Java.type('org.bukkit.entity.EntityType').EVOKER, SpawnEntitytick: 10, SpawnEntityms: 5000, speed: 3 },  
];


//====================================================================================================================

function tick(info) {
    var machine = info.machine();
    var location = info.block().getLocation();
    let world = location.getWorld();

    let sfitem =  StorageCacheUtils.getSfItem(location);
    if (sfitem == null){
        // org.bukkit.Bukkit.broadcastMessage("不是一个粘液物品");
        return;
    }
    
    let sfitemid = sfitem.getId()

    // 查找匹配的生成器类型配置
let spawnerConfig = SPAWNER_TYPE.find(spawner => spawner.id === sfitemid);

if (spawnerConfig) {
    // 如果找到匹配项，则应用对应的值
    var LatestSpawnEntity = spawnerConfig.LatestSpawnEntity;
    var SpawnEntitytick = spawnerConfig.SpawnEntitytick;
    var SpawnEntityms = spawnerConfig.SpawnEntityms;
    var speed = spawnerConfig.speed;

} else {
    // org.bukkit.Bukkit.broadcastMessage("未找到匹配的生成器配置");
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

        let numWitherSkeletons = countWitherSkeletonsInRange(world, location, radius, LatestSpawnEntity);
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
        
        let i = 0; 
        for (; i < speed; i++) {

        // 生成一个新位置，在原始位置的Y坐标上加1
        let randomNum1 = getRandomInt(-XYDistance, XYDistance);
        let randomNum2 = getRandomInt(YDECREASEDistance, YPLUSDistance);
        let spawnLocation = location.clone().add(randomNum1, randomNum2, randomNum1);
        
        world.spawnEntity(spawnLocation, LatestSpawnEntity);
        }
    }
}

function onPlace(event) {
    var player = event.getPlayer();
    // sendMessage(player, "方块被放置");

    // 当机器被放置时，清空该位置的最后使用时间和计数器记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);

    let sfitem =  StorageCacheUtils.getSfItem(location);
    if (sfitem == null){
        // org.bukkit.Bukkit.broadcastMessage("不是一个粘液物品");
        return;
    }
    
    let sfitemid = sfitem.getId()

    // 查找匹配的生成器类型配置
    let spawnerConfig = SPAWNER_TYPE.find(spawner => spawner.id === sfitemid);

    if (spawnerConfig) {
        // 如果找到匹配项，则应用对应的值
        var LatestSpawnEntity = spawnerConfig.LatestSpawnEntity;
        var SpawnEntitytick = spawnerConfig.SpawnEntitytick;
        var SpawnEntityms = spawnerConfig.SpawnEntityms;
        var speed = spawnerConfig.speed;

    } else {
        // org.bukkit.Bukkit.broadcastMessage("未找到匹配的生成器配置");
    }

    let block = event.getBlock();
    // 检查放置的方块是否为刷怪笼，并设置其属性
    if (block.getType() === org.bukkit.Material.SPAWNER) {
        let spawner = block.getState();
        if (spawner instanceof org.bukkit.block.CreatureSpawner) {
            let entityType = LatestSpawnEntity; // 或者其他实体类型

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

    // 当机器被破坏时，从映射中移除它的最后使用时间记录
    let location = event.getBlock().getLocation();
    lastUseTimes.remove(location);
    machineTickCounters.remove(location);
}

function countWitherSkeletonsInRange(world, location, radius, LatestSpawnEntity) {
    // 使用 getNearbyEntities 获取指定半径内的所有实体
    let entities = world.getNearbyEntities(location,radius, radius, radius);
    let count = 0;

    // 遍历这些实体并统计 WITHER_SKELETON 的数量
    for (let entity of entities) {
        if (entity.getType() === LatestSpawnEntity) {
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