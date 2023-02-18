const Discord = require("discord.js");
const config = require("./Main.Settings.json");
const axios = require("axios");
const client = new Discord.Client();
const disbut = require('discord-buttons')(client);
const { MessageButton, MessageActionRow } = require ('discord-buttons')
const fs = require('fs');
const mongoose = require("mongoose");
const database = require("./Schemas.js");
const models = require("./Models.js");
const RoleGuardian = new Discord.Client();
const ChannelGuardian = new Discord.Client();
const ServerGuardian = new Discord.Client();
const GuardAyar = require("./Guard.js")

mongoose.connect(config.Defaults.MongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
// Guardians Login //

client.login(config.Defaults.Token).catch(err => console.log("[TOKEN HATALI] Client Guardian Tokeni Hatalı!"))
RoleGuardian.login(config.Defaults.RoleGuardianToken).catch(err => console.log("[TOKEN HATALI] Role Guardian Tokeni Hatalı!"))
ChannelGuardian.login(config.Defaults.ChannelGuardianToken).catch(err => console.log("[TOKEN HATALI] Channel Guardian Tokeni Hatalı!"))
ServerGuardian.login(config.Defaults.ServerGuardianToken).catch(err => console.log("[TOKEN HATALI] Server Guardian Tokeni Hatalı!"))

client.on("message", async(message) => {
if(config.Defaults.BotOwners.some(x => message.author.id.includes(x))) {
if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(config.Defaults.Prefix)) return;
let args = message.content.split(' ').slice(1);
let command = message.content.split(' ')[0].slice(config.Defaults.Prefix.length);
if(command==="guardkomutlar") {
const embed = new Discord.MessageEmbed()
message.channel.send(embed.setDescription(`
**${config.Defaults.Prefix}güvenli @winnie/ID (Belirtilen üyeyi güvenli listeye eklersiniz/çıkartırsınız.)**
**${config.Defaults.Prefix}güvenliliste (Güvenli listede olan üyeleri görüntülersiniz.)**
**${config.Defaults.Prefix}güvenlirol (Belirtilen rolü güvenli rol listesine eklersiniz.)**
`))
}
    if(command === "güvenli") {
    let hedef;
    let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (uye) hedef = uye;
    if (!hedef) return message.reply("Geçerli bir üye belirt!");
      let verie = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": [],
        "SagTikSafe": [],
    };  
    let sonuc1;
    let sonuc2;
    let sonuc3;
    let sonuc4;
    let sonuc5;
    let sonuc6;
    if(verie.AllSafe.includes(hedef.id)) { sonuc1 = 'green' } else { sonuc1 = 'grey' };
    if(verie.ChannelSafe.includes(hedef.id)) { sonuc2 = 'green' } else { sonuc2 = 'grey' };
    if(verie.RolSafe.includes(hedef.id)) { sonuc3 = 'green' } else { sonuc3 = 'grey' };
    if(verie.ServerSafe.includes(hedef.id)) { sonuc4 = 'green' } else { sonuc4 = 'grey' };
    if(verie.SagTikSafe.includes(hedef.id)) { sonuc6 = 'green' } else { sonuc6 = 'grey' };
      
    const embed = new Discord.MessageEmbed().setDescription(`**Merhaba!** ${message.author.tag} \n\n ${hedef} isimli kullanıcıyı hangi güvenliğe eklemek/çıkarmak istersiniz?\n\n\`NOT:\`Eğer kullanıcı güvenlideyse buton **yeşil** gözükür. Güvenlide değilse buton **füme** renginde gözükür.`)
 
const shavie1 = new MessageActionRow()
.addComponents(
new MessageButton().setStyle(sonuc1).setLabel('Full Yönetim').setID('allsafe'),
new MessageButton().setStyle(sonuc3).setLabel('Rol').setID('rolsafe'),
new MessageButton().setStyle(sonuc2).setLabel('Kanal').setID('kanalsafe'),
new MessageButton().setStyle(sonuc4).setLabel('Sunucu Yönetimi').setID('serversafe'),
)
const shavie2 = new MessageActionRow()
.addComponents(
new MessageButton().setStyle(sonuc6).setLabel('Sağ-Tık').setID('sagtik'),
)
   message.channel.send({ embed: embed, components: [shavie1,shavie2] })
  
client.on("clickButton", async (button) => {

  if(button.id === "allsafe") { 
      let veri = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": []
    };
      if(veri.AllSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $pull: {AllSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Full Yönetim** listesinden çıkarıldı!`).then(x => {
  process.exit(1);
})    
      } else if(!veri.AllSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $push: {AllSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Full Yönetim** listesine eklendi!`).then(x => {
  process.exit(1);
})    
      }
  }
  
  if(button.id === "rolsafe") { 
      let veri = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": []
    };
      if(veri.RolSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $pull: {RolSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Rol Yönetim** listesinden çıkarıldı!`).then(x => {
  process.exit(1);
})    
      } else {
await database.updateOne({ guildID: message.guild.id}, { $push: {RolSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Rol Yönetim** listesine eklendi!`).then(x => {
  process.exit(1);
})    
      }
  }  
  if(button.id === "kanalsafe") { 
      let veri = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": []
    };
      if(veri.ChannelSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $pull: {ChannelSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Kanal Yönetim** listesinden çıkarıldı!`).then(x => {
  process.exit(1);
})    
      } else {
await database.updateOne({ guildID: message.guild.id}, { $push: {ChannelSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Kanal Yönetim** listesine eklendi!`).then(x => {
  process.exit(1);
})    
      }
  }  
  if(button.id === "serversafe") { 
      let veri = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": []
    };
      if(veri.ServerSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $pull: {ServerSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Server Yönetim** listesinden çıkarıldı!`).then(x => {
  process.exit(1);
})    
      } else {
await database.updateOne({ guildID: message.guild.id}, { $push: {ServerSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Server Yönetim** listesine eklendi!`).then(x => {
  process.exit(1);
})    
      }
  } 
  if(button.id === "sagtik") { 
      let veri = await database.findOne({ guildID: message.guild.id }) || {
        "AllSafe": [],
        "ChannelSafe": [],
        "RolSafe": [],
        "ServerSafe": [],
        "SagTikSafe": [],
    };
      if(veri.SagTikSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $pull: {SagTikSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Sağ-Tık** listesinden çıkarıldı!`).then(x => {
  process.exit(1);
})    
      } else if(!veri.SagTikSafe.includes(hedef.id)) {
await database.updateOne({ guildID: message.guild.id}, { $push: {SagTikSafe: hedef.id } }, { upsert: true });
message.channel.send(`${uye} isimli kullanıcı başarıyla **Sağ-Tık** listesine eklendi!`).then(x => {
  process.exit(1);
})    
      }
  }  
  })
            
}
if(command === "güvenlirol") {
let rol = message.guild.roles.cache.get(args[0]);
if(!rol) return message.channel.send(`Güvenli rol listesine eklemek istediğiniz rolü belirtin!`)
const güvenlirolveri = await models.findOne({guildID: message.guild.id}) || {
  GüvenliRol: ""
};
if(güvenlirolveri.GüvenliRol.includes(rol.id)) {
  await models.updateOne({guildID: message.guild.id}, { $pull: { GüvenliRol: rol.id }}, { upsert: true});
  message.channel.send(`<@&${rol.id}> isimli rol başarıyla **Güvenli Rol** listesinden çıkarıldı! \n\n\`Güvenli Rol : Sunucuda olan izinsiz işlemlerde yetkisi kapatılmayacak rol(ler).\``).then(x => {
  process.exit(1);
})    
} else {
   await models.updateOne({guildID: message.guild.id}, { $push: { GüvenliRol: rol.id }}, { upsert: true});
  message.channel.send(`<@&${rol.id}> isimli rol başarıyla **Güvenli Rol** listesine eklendi! \n\n\`Güvenli Rol : Sunucuda olan izinsiz işlemlerde yetkisi kapatılmayacak rol(ler).\``).then(x => {
  process.exit(1);
})    
}
}
if(command === "güvenliliste") {
    const embed = new Discord.MessageEmbed().setDescription(`**Merhaba!** ${message.author.tag} \n\n Hangi güvenli listesine bakmak istersiniz butonlardan seçiniz.`)
    const embed2 = new Discord.MessageEmbed();
  const data = await database.findOne({ guildID: message.guild.id});
  const data2 = await models.findOne({ guildID: message.guild.id});
  let tümgüvenli = data && data.AllSafe;
  const allliste = tümgüvenli.map((x, index) => `\`${index+1}.\` <@${x}>`)
  
   let rolgüvenli = data && data.RolSafe;
  const rolliste = rolgüvenli.map((x, index) => `\`${index+1}.\` <@${x}>`) 
  
   let kanalgüvenli = data && data.ChannelSafe;
  const kanalliste = kanalgüvenli.map((x, index) => `\`${index+1}.\` <@${x}>`)
  
  let sunucugüvenli = data && data.ServerSafe;
  const sunuculiste = sunucugüvenli.map((x, index) => `\`${index+1}.\` <@${x}>`)
  
     let sagtik = data && data.SagTikSafe;
  const sagtikliste = sagtik.map((x, index) => `\`${index+1}.\` <@${x}>`) 
  
    let güvenlirol = data2 && data2.GüvenliRol;
  const güvenlirolliste = güvenlirol.map((x, index) => `\`${index+1}.\` <@&${x}>`)
  
const shavie1 = new MessageActionRow()
.addComponents(
new MessageButton().setStyle('grey').setLabel('Full Güvenli Listesi').setID('allsafeliste'),
new MessageButton().setStyle('grey').setLabel('Rol Güvenli Listesi').setID('rolsafeliste'),
new MessageButton().setStyle('grey').setLabel('Kanal Güvenli Listesi').setID('kanalsafeliste'),
new MessageButton().setStyle('grey').setLabel('Sunucu Güvenli Listesi').setID('serversafeliste'),
)
const shavie2 = new MessageActionRow().addComponents(
new MessageButton().setStyle('grey').setLabel('Sağ-Tık Güvenli Listesi').setID('sagtiklistesafe'),
new MessageButton().setStyle('grey').setLabel('Güvenli Rol Listesi').setID('güvenlirolliste')
)

   message.channel.send({ embed:embed , components: [shavie1,shavie2] })
  
client.on("clickButton", async (button) => {
if(button.id === "güvenlirolliste") {
message.channel.send(embed2.setAuthor(`Güvenli Rol Listesi!`).setDescription(güvenlirolliste))
}
if(button.id === "allsafeliste") {
  message.channel.send(embed2.setAuthor(`Full Güvenli Listesi!`).setDescription(allliste))
}
if(button.id === "rolsafeliste") {
message.channel.send(embed2.setAuthor(`Rol Güvenli Listesi!`).setDescription(rolliste))
}
if(button.id === "kanalsafeliste") {
message.channel.send(embed2.setAuthor(`Kanal Güvenli Listesi!`).setDescription(kanalliste))
}
if(button.id === "serversafeliste") {
message.channel.send(embed2.setAuthor(`Sunucu Güvenli Listesi!`).setDescription(sunuculiste))
}
if(button.id === "sagtiklistesafe") {
message.channel.send(embed2.setAuthor(`Sağ-Tık Güvenli Listesi!`).setDescription(sagtikliste))
}
})  
}
if(command === "reboot") {
  message.channel.send("Bot yeniden başlatıldı!").then(x => {
    process.exit(1);
})
}
if(command==="ping") message.channel.send(`${client.ws.ping}`) 
if(command=== "guardayar") {
const Ayar = await GuardAyar.findOne({guildID: message.guild.id}) || {
        "RolKoruma": 0,
        "KanalKoruma": 0,
        "SunucuKoruma": 0,
        "SagTikKoruma": 0,
    };
  const embedmis = new Discord.MessageEmbed()
  let sonuc1;
  let sonuc2;
  let sonuc3;
  let sonuc4;
  let sonuc5;
  let rolsonuc;
  let kanalsonuc;
  let sunucusonuc;
  let sagtiksonuc;
  if(Ayar.RolKoruma === 0) { sonuc1 = 'grey', rolsonuc = 'Kapalı ❌' } else { sonuc1 = 'green', rolsonuc = 'Açık ✅' };
  if(Ayar.SunucuKoruma === 0) { sonuc2 = 'grey', sunucusonuc = 'Kapalı ❌' } else { sonuc2 = 'green', sunucusonuc = 'Açık ✅'};
  if(Ayar.KanalKoruma === 0) { sonuc3 = 'grey', kanalsonuc = 'Kapalı ❌' } else { sonuc3 = 'green', kanalsonuc = 'Açık ✅' };
  if(Ayar.SagTikKoruma === 0) { sonuc5 = 'grey', sagtiksonuc = 'Kapalı ❌' } else { sonuc5 = 'green', sagtiksonuc= 'Açık ✅' };
  
const shavie1 = new MessageActionRow()
.addComponents(
new MessageButton().setStyle(sonuc1).setLabel('Rol Koruma').setID('rolkoruma'),
new MessageButton().setStyle(sonuc3).setLabel('Kanal Koruma').setID('kanalkoruma'),
new MessageButton().setStyle(sonuc2).setLabel('Sunucu Koruma').setID('sunucukoruma'),
new MessageButton().setStyle(sonuc5).setLabel('Sağ-Tık Koruma').setID('sagtikkoruma'),
)
  
  message.channel.send(embedmis.setDescription(`Aşağıda \`${message.guild.name}\` sunucusunun koruma sistemi bulunmaktadır. Ayarları güncellemek istiyorsanız aşağıda ki butonları kullanabilirsiniz.\n\n **Rol Koruma:** \`${rolsonuc}\`\n**Kanal Koruma:** \`${kanalsonuc}\`\n**Sunucu Koruma:** \`${sunucusonuc}\`\n**Sağ-Tık Koruma:** \`${sagtiksonuc}\` \n\n**Bilgilendirme:**\nBelirtilen koruma açık ise düğmenin rengi yeşil, kapalı ise füme rengi olacaktır.`), {component: shavie1})
  client.on("clickButton", async(button) => {
if(button.id === "rolkoruma") {
if(Ayar.RolKoruma === 0) await GuardAyar.findOneAndUpdate({ guildID: message.guild.id }, { $set: { RolKoruma: 1 } }, { upsert: true })       
if(Ayar.RolKoruma === 1) await GuardAyar.findOneAndUpdate({ guildID: message.guild.id }, { $set: { RolKoruma: 0 } }, { upsert: true })       
}
if(button.id === "kanalkoruma") {
if(Ayar.KanalKoruma === 0) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { KanalKoruma: 1 } }, { upsert: true})  
if(Ayar.KanalKoruma === 1) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { KanalKoruma: 0 } }, { upsert: true})  
  
}
if(button.id === "sunucukoruma") {
if(Ayar.SunucuKoruma === 0) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { SunucuKoruma: 1 } }, { upsert: true})  
if(Ayar.SunucuKoruma === 1) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { SunucuKoruma: 0 } }, { upsert: true})  

}
if(button.id === "sagtikkoruma") {
if(Ayar.SagTikKoruma === 0) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { SagTikKoruma: 1 } }, { upsert: true})  
if(Ayar.SagTikKoruma === 1) await GuardAyar.findOneAndUpdate({guildID: message.guild.id}, { $set: { SagTikKoruma: 0 } }, { upsert: true})  
}    
  })
}
}
})

client.on("ready", async() => {
client.user.setPresence({activity: { name: config.Defaults.PresenceName}, status: config.Defaults.Status})
console.log("Client Guardian Online!")
})
RoleGuardian.on("ready", async() => {
RoleGuardian.user.setPresence({activity: { name: config.Defaults.PresenceName}, status: config.Defaults.Status})
console.log("Role Guardian Online!")
})
ChannelGuardian.on("ready", async() => {
ChannelGuardian.user.setPresence({activity: { name: config.Defaults.PresenceName}, status: config.Defaults.Status})
console.log("Channel Guardian Online!")
})
ServerGuardian.on("ready", async() => {
ServerGuardian.user.setPresence({activity: { name: config.Defaults.PresenceName}, status: config.Defaults.Status})
console.log("Server Guardian Online!")
})
// Role Guardians //

RoleGuardian.on("roleDelete", async(role) => {
let log = role.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(role.guild.name, RoleGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Rol Silindi!").setColor("GREEN")
let veri = await database.findOne({ guildID: role.guild.id });
let veri2 = await models.findOne({ guildID: role.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: role.guild.id});
let staff = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if (veri3.RolKoruma === 0) return;
if(veri.RolSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
role.guild.members.ban(staff.executor.id)
role.guild.members.ban(staff.executor.id)
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından **@${role.name}** (\`${role.id}\`) isimli rol silindi ve yapan kişi yasaklandı.\n\n**NOT:** Rol otomatik olarak kurulmadı, kurulum yapmak için: \`.ryükle ${role.id}\` komutunu kullanabilirsiniz.`))

let roles = RoleGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})

})

RoleGuardian.on("roleCreate", async(role) => {
let log = role.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(role.guild.name, RoleGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Rol Oluşturuldu!").setColor("GREEN")
let veri = await database.findOne({ guildID: role.guild.id });
let veri2 = await models.findOne({ guildID: role.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: role.guild.id});
if (veri3.RolKoruma === 0) return;
let staff = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.RolSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
role.guild.members.ban(staff.executor.id)
role.guild.members.ban(staff.executor.id)
await role.delete()
if(log) log.send(embed.setDescription(`${staff.executor} (__${staff.executor.id}__) tarafından bir rol oluşturuldu! Oluşturan kişi yasaklandı ve rol silindi.`))

let roles = RoleGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})

})

RoleGuardian.on("roleUpdate", async(oldRole, newRole) => {
let log = newRole.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const permissionStaff = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG"];
const embed = new Discord.MessageEmbed().setAuthor(newRole.guild.name, RoleGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Rol Güncellendi!").setColor("GREEN")
let veri = await database.findOne({ guildID: newRole.guild.id });
let veri2 = await models.findOne({ guildID: newRole.guild.id });
let staff = await newRole.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
let veri3 = await GuardAyar.findOne({ guildID: newRole.guild.id});
if (veri3.RolKoruma === 0) return;
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.RolSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
newRole.guild.members.ban(staff.executor.id)
newRole.guild.members.ban(staff.executor.id)
if (permissionStaff.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
newRole.setPermissions(oldRole.permissions);
newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
};
await newRole.edit({
name: oldRole.name,
color: oldRole.hexColor,
hoist: oldRole.hoist,
permissions: oldRole.permissions,
mentionable: oldRole.mentionable,
position: oldRole.position
})
if(log) log.send(embed.setDescription(`${staff.executor} (__${staff.executor.id}__) tarafından **${oldRole.name}** rolü güncellendi! Güncelleyen kişi yasaklandı ve rol eski haline getirildi.`))

let roles = RoleGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

// Channel Guardians //

ChannelGuardian.on("channelDelete", async(channel) => {
let log = channel.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(channel.guild.name, ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Kanal Silindi!").setColor("GREEN")
let veri = await database.findOne({ guildID: channel.guild.id });
let veri2 = await models.findOne({ guildID: channel.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: channel.guild.id});
if (veri3.KanalKoruma === 0) return;
let staff = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.ChannelSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
channel.guild.members.ban(staff.executor.id)
channel.guild.members.ban(staff.executor.id)
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal silindi ve geri oluşturularak yapan kişi yasaklandı.`))

let roles = ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

ChannelGuardian.on("channelCreate", async(channel) => {
let log = channel.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(channel.guild.name, ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Kanal Oluşturuldu!").setColor("GREEN")
let veri = await database.findOne({ guildID: channel.guild.id });
let veri2 = await models.findOne({ guildID: channel.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: channel.guild.id});
if (veri3.KanalKoruma === 0) return;
let staff = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.ChannelSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
channel.guild.members.ban(staff.executor.id)
channel.guild.members.ban(staff.executor.id)
await channel.delete()
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından \`#${channel.name}\` isimli kanal oluşturuldu ve geri silinip yapan kişi yasaklandı.`))


let roles = ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

ChannelGuardian.on("channelUpdate", async(oldChannel, newChannel) => {
let log = newChannel.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(newChannel.guild.name, ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Kanal Güncellendi!").setColor("GREEN")
let veri = await database.findOne({ guildID: newChannel.guild.id });
let veri2 = await models.findOne({ guildID: newChannel.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: newChannel.guild.id});
if (veri3.KanalKoruma === 0) return;
let staff = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.ChannelSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
newChannel.guild.members.ban(staff.executor.id)
if(newChannel.type === "category") {
await newChannel.edit({ 
  name: oldChannel.name,
  position: oldChannel.position
 })
}
  
if(newChannel.type === "voice") {
await newChannel.edit({
name: oldChannel.name,
bitrate: oldChannel.bitrate,
userLimit: oldChannel.userLimit,
parentID: oldChannel.parentID,
position: oldChannel.position
})
}

if ((newChannel.type === 'text') || (newChannel.type === 'news')) {
await newChannel.edit({
name: oldChannel.name,
topic: oldChannel.topic,
nsfw: oldChannel.nsfw,
parentID: oldChannel.parentID,
rateLimitPerUser: oldChannel.rateLimitPerUser,
position: oldChannel.position
})
}
oldChannel.permissionOverwrites.forEach(perm => {
let thisPermOverwrites = {};
perm.allow.toArray().forEach(p => {
thisPermOverwrites[p] = true;
});
perm.deny.toArray().forEach(p => {
thisPermOverwrites[p] = false;
});
newChannel.createOverwrite(perm.id, thisPermOverwrites);
});
  
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından \`#${oldChannel.name}\` isimli kanal güncellendi ve ayarları eski haline getirelerek yapan kişi yasaklandı.`))

let roles = ChannelGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

// Guild Guardians //

ServerGuardian.on("guildMemberAdd", async(user) => {
let log = user.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(user.guild.name, ServerGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuya Bot Eklendi!").setColor("GREEN")
let veri = await database.findOne({ guildID: user.guild.id });
let veri2 = await models.findOne({ guildID: user.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: user.guild.id});
if (veri3.SunucuKoruma === 0) return;
let staff = await user.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.ServerSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
if(!user.user.bot) return;
user.guild.members.ban(staff.executor.id)
user.guild.members.ban(user.id)
user.guild.members.ban(user.id)
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından sunucuya bot eklendi ve yapan kişi yasaklandı.`))

let roles = ServerGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

ServerGuardian.on("guildUpdate", async(oldGuild, newGuild) => {
let log = newGuild.guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(newGuild.guild.name, ServerGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Kanal Güncellendi!").setColor("GREEN")
let veri = await database.findOne({ guildID: oldGuild.guild.id });
let veri2 = await models.findOne({ guildID: oldGuild.guild.id });
let veri3 = await GuardAyar.findOne({ guildID: oldGuild.guild.id});
if (veri3.SunucuKoruma === 0) return;
let staff = await oldGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
if (!staff || !staff.executor || Date.now()-staff.createdTimestamp > 5000) return;
if(veri.ServerSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;
newGuild.members.ban(staff.executor.id)
newGuild.members.ban(staff.executor.id)
if (newGuild.name !== oldGuild.name) await newGuild.setName(oldGuild.name);
if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) await newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
if (oldGuild.banner !== newGuild.banner) await newGuild.setBanner(oldGuild.bannerURL({ size: 4096 }));
if(oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
ServerGuardian.setURL(newGuild.id)
newGuild.members.ban(staff.executor.id)
newGuild.members.ban(staff.executor.id)
}
  
if(log) log.send(embed.setDescription(`${staff.executor} (\`${staff.executor.id}\`) tarafından sunucudan sunucu güncellendi! Güncelleyen kişi banlandı ve sunucu eski haline getirildi.`))

let roles = ServerGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

ServerGuardian.on("guildBanAdd", async(guild,user) => {
let log = guild.channels.cache.find(k => k.id === config.Channels.LogChannel)
const embed = new Discord.MessageEmbed().setAuthor(guild.name, ServerGuardian.guilds.cache.get(config.Defaults.GuildID).iconURL({dynamic: true})).setTitle("Sunucuda Sağ-Tık Yasaklama Atıldı!").setColor("GREEN")
let staff = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
let veri = await database.findOne({ guildID: config.Defaults.GuildID });
let veri2 = await models.findOne({ guildID: config.Defaults.GuildID });
let veri3 = await GuardAyar.findOne({ guildID: config.Defaults.GuildID });
if (veri3.SagTikKoruma === 0) return;
if(veri.SagTikSafe.includes(staff.executor.id)) return;
if(veri.AllSafe.includes(staff.executor.id)) return;  
guild.members.ban(staff.executor.id)
guild.members.ban(staff.executor.id)
await guild.members.unban(user.id, "Sağ tık ile banlandığı için geri açıldı!").catch(console.error);
if(log) log.send(embed.setDescription(`${user} (\`${user.id}\`) üyesi, ${staff.executor} (\`${staff.executor.id}\`) tarafından sunucudan \`Sağ-Tık\` ile yasaklandı!`))

let roles = ServerGuardian.guilds.cache.get(config.Defaults.GuildID).roles.cache.filter(role => role.managed && role.position < role.guild.me.roles.highest.position && role.permissions.has("MANAGE_GUILD") || role.permissions.has("BAN_MEMBERS") || role.permissions.has("MANAGE_ROLES") || role.permissions.has("MANAGE_WEBHOOKS") || role.permissions.has("MANAGE_NICKNAMES") || role.permissions.has("MANAGE_CHANNELS") || role.permissions.has("KICK_MEMBERS") || role.permissions.has("ADMINISTRATOR")).forEach(async r => {
if(veri2.GüvenliRol.includes(r.id)) return 
await r.setPermissions(0).catch(() => { })
})
})

// Functions //

ServerGuardian.setURL = (guildID) => {
    axios({
     method: "patch",
     url: `https://discord.com/api/v6/guilds/${config.Defaults.GuildID}/vanity-url`,
      data: {
       code: `${config.Defaults.vanityURLCode}`
    },
      headers: {
        authorization: `Bot ${config.Defaults.ServerGuardianToken}`
    }})};



