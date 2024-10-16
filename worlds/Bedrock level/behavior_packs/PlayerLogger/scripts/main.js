import {
    EquipmentSlot,
    EnchantmentType,
    world,
    system,
    EntityComponentTypes,
    ItemComponentTypes
} from "@minecraft/server";
import {
    HttpRequest, HttpHeader, HttpRequestMethod, http
} from '@minecraft/server-net';
import {
    itemsid
} from 'itemsid.js';
import {
    locsname
} from 'locsname.js';
function getPlayers() {
    const allPlayers = world.getAllPlayers();
    if (allPlayers.length === 0) {
        return undefined;
    }

    return allPlayers;
}
//获取位置名称
function location2(dimid,loc){
    const x = Math.round(loc.x);
    const y = Math.round(loc.y);
    const z = Math.round(loc.z);
    const names = Object.keys(locsname);
    var namestr = `(`;
    for (const name of names) {
        const v = locsname[name];
        if(v[0] === dimid){
            const fx = v[1]<v[4]?v[1]:v[4];
            const fy = v[2]<v[5]?v[2]:v[5];
            const fz = v[3]<v[6]?v[3]:v[6];
            const tx = v[1]>v[4]?v[1]:v[4];
            const ty = v[2]>v[5]?v[2]:v[5];
            const tz = v[3]>v[6]?v[3]:v[6];
            if(fx <= x && x <= tx){
                if(fy <= y && y <= ty){
                    if(fz <= z && z <= tz){
                        namestr += `${name},`
                    }
                }
            }
        }
    }
    if(namestr.length !== 1){
        namestr = namestr.slice(0,-1);
    }
    namestr += ")";
    return namestr;
}
//事件随机标识符
function generateRandomIdentifier() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
//按按钮
world.afterEvents.buttonPush.subscribe((buttonPushEvent) => {
    const eventLoc = buttonPushEvent.block.location;
    const message = "按钮被按动， 坐标 "+eventLoc.x+" "+eventLoc.y+" "+eventLoc.z+" 当前游戏刻"+ system.currentTick;
    
    sendlog(message+" line_37");
});
//拉拉杆
world.afterEvents.leverAction.subscribe((event)=>{
    const player = event.player;
    if (event.isPowered){
        const message = `${player.name}激活了位于 ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} 的拉杆`;
        sendlog(message+" line_44");
    }else{
        const message = `${player.name}关闭了位于 ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} 的拉杆`;
        sendlog(message+" line_47");
    }
});
//打破方块
world.afterEvents.playerBreakBlock.subscribe((breakBlockEvent) =>{
    const eventLoc = breakBlockEvent.block.location;
    const message = `${breakBlockEvent.player.name}在${itemsid[breakBlockEvent.player.dimension.id]}打破了 ${eventLoc.x} ${eventLoc.y} ${eventLoc.z} ${location2(breakBlockEvent.block.dimension.id,eventLoc)} 的${itemsid[breakBlockEvent.brokenBlockPermutation.type.id]}`;

    sendlog(message+" line_55");
});
//玩家放置方块
world.afterEvents.playerPlaceBlock.subscribe((placeBlockEvent) =>{
    const eventLoc = placeBlockEvent.block.location;
    const eventPlayer = placeBlockEvent.player;
    const message = `${eventPlayer.name}在${itemsid[eventPlayer.dimension.id]} ${eventLoc.x} ${eventLoc.y} ${eventLoc.z} ${location2(placeBlockEvent.block.dimension.id,eventLoc)} 放置了${itemsid[placeBlockEvent.block.type.id]}`;

    sendlog(message+" line_63");
});
//实体死亡
world.afterEvents.entityDie.subscribe((entityDieEvent) =>{
    const damageSource = entityDieEvent.damageSource;
    const damagingEntity = damageSource.damagingEntity;
    const deadEntity = entityDieEvent.deadEntity;
    var message;
    const deadEntityEvent = ['僵尸猪人', '雪球','猫','铁傀儡'];
    if(deadEntityEvent.includes(itemsid[deadEntity.typeId])){

    }else{
        if(itemsid[deadEntity.typeId] === "玩家"){
            if(damagingEntity === undefined){
                message = `${itemsid[deadEntity.typeId]}${deadEntity.name}被 ${itemsid[damageSource.cause]} 死了， 坐标${itemsid[deadEntity.dimension.id]} ${Math.round(deadEntity.getHeadLocation().x)} ${Math.round(deadEntity.getHeadLocation().y)} ${Math.round(deadEntity.getHeadLocation().z)} ${location2(deadEntity.dimension.id,deadEntity.location)}`;
            }else{
                if(itemsid[damagingEntity.typeId] === "玩家"){
                    message = `${deadEntity.name}被${damagingEntity.name}杀死了， 死亡原因 ${itemsid[damageSource.cause]} 坐标${itemsid[deadEntity.dimension.id]} ${Math.round(deadEntity.getHeadLocation().x)} ${Math.round(deadEntity.getHeadLocation().y)} ${Math.round(deadEntity.getHeadLocation().z)} ${location2(deadEntity.dimension.id,deadEntity.location)}`;
                }else{
                    message = `${itemsid[deadEntity.typeId]}${deadEntity.name} 死亡，原因 ${itemsid[damageSource.cause]} 攻击实体 ${itemsid[damagingEntity.typeId]} 坐标${itemsid[deadEntity.dimension.id]} ${Math.round(deadEntity.getHeadLocation().x)} ${Math.round(deadEntity.getHeadLocation().y)} ${Math.round(deadEntity.getHeadLocation().z)} ${location2(deadEntity.dimension.id,deadEntity.location)}`;
                }
            }
        }else{
            if(damagingEntity === undefined){
                message = `${itemsid[deadEntity.typeId]}被 ${itemsid[damageSource.cause]} 死了`;
            }else{
                if(itemsid[damagingEntity.typeId] === "玩家"){
                    message = `${damagingEntity.name}杀死了${itemsid[deadEntity.typeId]} 死亡原因 ${itemsid[damageSource.cause]} 坐标${itemsid[deadEntity.dimension.id]} ${Math.round(deadEntity.getHeadLocation().x)} ${Math.round(deadEntity.getHeadLocation().y)} ${Math.round(deadEntity.getHeadLocation().z)} 测试x坐标${deadEntity.location.x} ${location2(deadEntity.dimension.id,deadEntity.location)}`;
                
                }else{
                    message = `${itemsid[deadEntity.typeId]} 死亡，原因 ${itemsid[damageSource.cause]} 攻击实体 ${itemsid[damagingEntity.typeId]} 坐标 没有`;
                }
            }
        }
        sendlog(message+" line_97");
    }
    
});
//玩家与盔甲架交互（实体）
const interactEithEntity = ["盔甲架"]
world.afterEvents.playerInteractWithEntity.subscribe((event)=>{
    const player = event.player;
    const target = event.target;
    const itemstack = event.itemStack;
    if(interactEithEntity.includes(itemsid[target.typeId])){
        var nametag;
        const identify = generateRandomIdentifier();
        var itemid;
        if(itemstack === undefined){
            itemid = '空手';
        }else{
            if(itemstack.nameTag === undefined){
                nametag = '';
            }else{
                nametag = itemstack.nameTag
            }
            itemid = itemsid[itemstack.typeId];
        }
        
        //const equipments = target.getComponent(EntityComponentTypes.Equippable).getEquipment(EquipmentSlot.Mainhand).typeId;
        const message = `${player.name}手持${nametag} ${itemid} 与 ${itemsid[target.typeId]} 交互，位置 ${itemsid[target.dimension.id]} ${Math.round(target.location.x)} ${Math.round(target.location.y)} ${Math.round(target.location.z)} ${location2(target.dimension.id,target.location)} 事件${identify}`;
        sendlog(message+" line_124");
        const targetid = event.target.typeId;
        const targetlocation = target.location;
        const targetdimid = target.dimension.id;
        const signal = world.afterEvents.playerInteractWithBlock.subscribe((event2)=>{
            const container2 = player.getComponent("inventory").container;
            var items2 = '';
            if(container2.size !== container2.emptySlotsCount){
                for(let i=0;i <container2.size;i++){
                    const item = container2.getItem(i);
                    if(item !== undefined){
                        if(item.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                            if(item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                                items2 += `${itemsid[item.typeId]}`;
                                for (const enchantid of item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                    items2 += ` <${itemsid[enchantid.type.id]}${enchantid.level}>`;//背包物品附魔效果
                                }
                               items2 +=', ';
                            }
                        }else{
                            items2 += `${itemsid[item.typeId]}x${item.amount}， `;
                        }
                    }
                }
            }else{
                items2 += '空的';
            }
            const equipments = player.getComponent(EntityComponentTypes.Equippable);
            var equipmentparts ='';
            const equipmentslots =[EquipmentSlot.Offhand,EquipmentSlot.Head,EquipmentSlot.Chest,EquipmentSlot.Legs,EquipmentSlot.Feet,EquipmentSlot.Body];
            for (const part of equipmentslots){
                const item2 = equipments.getEquipment(part);
                if(item2 !== undefined){
                    if(item2.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                        if(item2.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                            equipmentparts += `${item2.nameTag === undefined ? '' : `(${item2.nameTag})`}${itemsid[item2.typeId]}`;
                            for (const enchantid of item2.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                equipmentparts += `<${itemsid[enchantid.type.id]}${enchantid.level}>`;//装备附魔效果
                            }
                            equipmentparts+=', ';
                        }
                    }else{
                        equipmentparts += `${item2.nameTag === undefined ? '' : `(${item2.nameTag})`}${itemsid[item2.typeId]}, `;
                    }
                }
            }
            const chestinfo2 = `事件${identify} 玩家${player.name}与其他方块交互，可能已经离开了${itemsid[targetid]},刚才的${itemsid[targetid]}坐标： ${Math.round(targetlocation.x)} ${Math.round(targetlocation.y)} ${location2(targetdimid,targetlocation)} ${Math.round(targetlocation.z)} [玩家物品列表： ${items2}] [玩家装备列表： ${equipmentparts}]`;
            sendlog(chestinfo2+" line_170");
            world.afterEvents.playerInteractWithBlock.unsubscribe((signal));
        });
    }
   

});
//玩家与带箱子的实体交互
const containerEntities = ["运输船","金合欢木箱子船","白桦木箱子船","樱花木箱子船","深色橡木箱子船","丛林木箱子船","红树林箱子船","橡木箱子船","云杉木箱子船","运输矿车","漏斗矿车","竹箱子筏","行商羊驼","羊驼","驴","骡"];
world.afterEvents.playerInteractWithEntity.subscribe((event)=>{
    const conpoment = event.target.getComponent("inventory");
    for (const entityid of containerEntities) {
        if(entityid === itemsid[event.target.typeId] && conpoment){
            const message =`${event.player.name}与 ${itemsid[event.target.typeId]} 交互， 位置 ${itemsid[event.target.dimension.id]} ${Math.round(event.target.location.x)} ${Math.round(event.target.location.y)} ${Math.round(event.target.location.z)} ${location2(event.target.dimension.id,event.target.location)}`;
            const container = conpoment.container;
            var items = '';
            if(container.size !== container.emptySlotsCount){
                for (let i=0;i<container.size;i++){
                    const item = container.getItem(i);
                    if(item !== undefined){
                        if(item.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                            if(item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                                items += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}`;
                                for (const enchantid of item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                    items += ` <${itemsid[enchantid.type.id]}${enchantid.level}>`;//实体箱子物品附魔效果
                                }
                               items +=', ';
                            }
                        }else{
                            items += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}x${item.amount}， `;
                        }
                    }
                }
            }else{
                items+='空的';
            }
            const chestinfo = `${message}， 容器大小：${container.size}, 空槽数：${container.emptySlotsCount}, [物品列表： ${items}]`;
            sendlog(chestinfo+" line_207");
        }
    }
});
//玩家与箱子交互
const containerBlocks = ["木桶","箱子","黑色潜影盒","蓝色潜影盒","棕色潜影盒","青色潜影盒","灰色潜影盒","绿色潜影盒","淡蓝色潜影盒","浅灰色潜影盒","黄绿色潜影盒","品红色潜影盒","橙色潜影盒","粉红色潜影盒","紫色潜影盒","红色潜影盒","未染色潜影盒","白色潜影盒","黄色潜影盒","陷阱箱子"];
world.afterEvents.playerInteractWithBlock.subscribe((event)=>{
    for (const blockid of containerBlocks) {
        if(blockid === itemsid[event.block.typeId]){
            const chestblock = event.block
            const container = chestblock.getComponent("inventory").container;
            const identify = generateRandomIdentifier();
            var items = ``;
            if(container.size !== container.emptySlotsCount){
                for(let i=0;i <container.size;i++){
                    const item = container.getItem(i);
                    if(item !== undefined){
                        if(item.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                            if(item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                                items += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}`;
                                for (const enchantid of item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                    items += ` <${itemsid[enchantid.type.id]}${enchantid.level}>`;//箱子物品附魔效果
                                }
                               items +=', ';
                            }
                        }else{
                            items += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}x${item.amount}， `;
                        }
                    }
                }
            }else{
                items += '空的';
            }
            const chestinfo = `${event.player.name}尝试打开位于${itemsid[event.block.dimension.id]} ${event.block.x} ${event.block.y} ${event.block.z} ${location2(chestblock.dimension.id,chestblock.location)} 的 ${itemsid[event.block.typeId]}, 容器大小：${container.size}, 空槽数：${container.emptySlotsCount}, [物品列表：${items}] 事件${identify}`;
            sendlog(chestinfo+" line_241");
            const player = event.player;
            const blockid = chestblock.typeId;
            const blocklocation = chestblock.location;
            const blcokdimid = event.block.dimension.id;
            const signal = world.afterEvents.playerInteractWithBlock.subscribe((event2)=>{
                var items2 = '';
                if(!container.isValid()){
                    sendlog(`事件${identify} 位于${itemsid[blcokdimid]} ${blocklocation.x} ${blocklocation.y} ${blocklocation.z} ${location2(chestblock.dimension.id,chestblock.location)} 的${itemsid[blockid]}找不到，可能已被挖掘，也可能不在加载区块范围内`);
                }else{
                    const container2 = chestblock.getComponent("inventory").container;
                    if(container2.size !== container2.emptySlotsCount){
                        for(let i=0;i <container2.size;i++){
                            const item = container2.getItem(i);
                            if(item !== undefined){
                                if(item.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                                    if(item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                                        items2 += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}`;
                                        for (const enchantid of item.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                            items2 += ` <${itemsid[enchantid.type.id]}${enchantid.level}>`;//箱子物品附魔效果
                                        }
                                       items2 +=', ';
                                    }
                                }else{
                                    items2 += `${item.nameTag === undefined ? '' : `(${item.nameTag})`}${itemsid[item.typeId]}x${item.amount}， `;
                                }
                            }
                        }
                    }else{
                        items2 += '空的';
                    }
                    const chestinfo2 = `事件${identify} 玩家${player.name}与其他方块交互，可能已经离开了${itemsid[blockid]},刚才的${itemsid[blockid]}坐标：${itemsid[blcokdimid]} ${blocklocation.x} ${blocklocation.y} ${blocklocation.z} ${location2(blcokdimid,blocklocation)} 容器大小：${container2.size}, 空槽数：${container2.emptySlotsCount}, [箱子里的物品列表： ${items2}]`;
                    sendlog(chestinfo2+" line_272");
                }
                world.afterEvents.playerInteractWithBlock.unsubscribe((signal));
            });
        }
    }
});
// 玩家加入
world.afterEvents.playerJoin.subscribe((playerJoinEvent) =>{
    const eventPlayer = playerJoinEvent;
    const message = `${eventPlayer.playerName}加入了游戏，标识符：${eventPlayer.playerId}`;
    sendlog(message);
});
//玩家退出
world.afterEvents.playerLeave.subscribe((playerLeaveEvent) =>{
    const eventPlayer = playerLeaveEvent;
    const message = `${eventPlayer.playerName}离开了游戏，标识符：${eventPlayer.playerId}`;
    sendlog(message);
});
//玩家维度更改
world.afterEvents.playerDimensionChange.subscribe((playerDimensionChangeEvent) =>{
    const eventPlayer = playerDimensionChangeEvent.player;
    const message = `${eventPlayer.name}从${itemsid[playerDimensionChangeEvent.fromDimension.id]} ${Math.round(playerDimensionChangeEvent.fromLocation.x)} ${Math.round(playerDimensionChangeEvent.fromLocation.y)} ${Math.round(playerDimensionChangeEvent.fromLocation.z)} ${location2(playerDimensionChangeEvent.fromDimension.id,playerDimensionChangeEvent.fromLocation)} 传送到了${itemsid[playerDimensionChangeEvent.toDimension.id]} ${Math.round(playerDimensionChangeEvent.toLocation.x)} ${Math.round(playerDimensionChangeEvent.toLocation.y)} ${Math.round(playerDimensionChangeEvent.toLocation.z)} ${location2(playerDimensionChangeEvent.toDimension.id,playerDimensionChangeEvent.toLocation)}`
    sendlog(message);
});
//发送日志
async function sendlog(log) {
    // world.sendMessage(log);
    const req = new HttpRequest("http://localhost/textlog.php");
    req.body =JSON.stringify({
        text: log,
    });
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader('Content-Type', 'application/json'),
        new HttpHeader('auth', 'minecraft-javascript'),
    ];
    await http.request(req);
}
//脚本加载
world.afterEvents.worldInitialize.subscribe((event)=>{
    sendlog("玩家行为日志脚本已重新加载");
});
//玩家位置
system.runInterval(()=>{
    const players = getPlayers();
    if(players !== undefined){
        for (const player of players) {
            const playerDimension = player.dimension;
            const playerLocation = player.location;
            if(player !== undefined){
                const mainhanditem =  player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
                var mainhand = ``;
                if(mainhanditem !== undefined){
                    if(mainhanditem.getComponent(ItemComponentTypes.Enchantable) !== undefined){
                        if(mainhanditem.getComponent(ItemComponentTypes.Enchantable).getEnchantments()[0] !== undefined){
                            mainhand += `${mainhanditem.nameTag === undefined ? '' : `(${mainhanditem.nameTag})`}${itemsid[mainhanditem.typeId]}`;
                            for (const enchantid of mainhanditem.getComponent(ItemComponentTypes.Enchantable).getEnchantments()) {
                                mainhand += ` <${itemsid[enchantid.type.id]}${enchantid.level}>`;//主手物品附魔效果
                            }
                        }
                    }else{
                        mainhand += `${mainhanditem.nameTag === undefined ? '' : `(${mainhanditem.nameTag})`}${itemsid[mainhanditem.typeId]}x${mainhanditem.amount}`;
                    }
                }
                sendlog(`${player.name}现在位于${itemsid[playerDimension.id]}, 坐标 ${Math.round(playerLocation.x)} ${Math.round(playerLocation.y)} ${Math.round(playerLocation.z)} ${location2(playerDimension.id,playerLocation)} 主手物品： ${mainhand}${player.isSleeping ? ' 正在睡觉' : ''}`)
            }
        }
    }
},600);