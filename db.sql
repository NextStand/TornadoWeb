/*
SQLyog Ultimate v12.5.0 (64 bit)
MySQL - 8.0.13 : Database - db_luckdraw
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_luckdraw` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

USE `db_luckdraw`;

/*Table structure for table `base_code` */

CREATE TABLE `base_code` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑主键',
  `bc_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '业务主键',
  `bc_treeid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '树节点id',
  `bc_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '配置名称',
  `bc_remark` varchar(32) DEFAULT NULL COMMENT '备注',
  `bc_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
  `bc_createuid` varchar(32) NOT NULL COMMENT '创建人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bc_id` (`bc_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `base_tree` */

CREATE TABLE `base_tree` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑主键',
  `bt_treeid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '业务主键',
  `bt_ptreeid` varchar(32) DEFAULT NULL,
  `bt_name` varchar(32) NOT NULL COMMENT '配置名称（限32字）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bt_treeid` (`bt_treeid`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `busi_msginfo` */

CREATE TABLE `busi_msginfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `i_id` varchar(32) NOT NULL COMMENT '业务主键',
  `i_activedate` varchar(64) DEFAULT NULL COMMENT '活动日期',
  `i_troduce` varchar(240) DEFAULT NULL COMMENT '副标题',
  `i_content` text NOT NULL COMMENT '信息内容',
  `i_createuid` varchar(32) NOT NULL COMMENT '创建人',
  `i_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `i_id` (`i_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `busi_open` */

CREATE TABLE `busi_open` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑主键',
  `b_id` varchar(32) NOT NULL COMMENT '业务主键',
  `b_code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '开奖号',
  `b_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开奖时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `b_id` (`b_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `busi_share` */

CREATE TABLE `busi_share` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑主键',
  `b_shareid` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分享者id',
  `b_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '分享时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `b_shareid` (`b_shareid`)
) ENGINE=MyISAM AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `busi_tzcord` */

CREATE TABLE `busi_tzcord` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `t_uid` varchar(32) NOT NULL COMMENT '用户openid',
  `t_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户姓名',
  `t_tel` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户手机号',
  `t_carid` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '东方汇卡号',
  `t_tzcode` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '投注码',
  `t_from` tinyint(4) NOT NULL DEFAULT '0' COMMENT '投注来源0-真实投注人 1-虚拟投注人',
  `t_mul` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '翻倍倍数',
  `t_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投注时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_uid` (`t_uid`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `busi_tzflow` */

CREATE TABLE `busi_tzflow` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '逻辑主键',
  `t_id` varchar(32) NOT NULL COMMENT '业务主键',
  `t_codeid` varchar(32) NOT NULL COMMENT '投注用户id',
  `t_state` tinyint(4) NOT NULL DEFAULT '0' COMMENT '投注状态码0-投注 1-激活 2-已兑奖',
  `t_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '流水日志发生时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `comp_sysuer` */

CREATE TABLE `comp_sysuer` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cu_userid` varchar(32) NOT NULL,
  `cu_usercode` varchar(32) NOT NULL COMMENT '登录账号',
  `cu_username` varchar(32) DEFAULT NULL COMMENT '用户姓名',
  `cu_phone` varchar(12) DEFAULT NULL COMMENT '电话号码',
  `cu_password` varchar(32) NOT NULL COMMENT '用户密码',
  `cu_avator` varchar(32) DEFAULT NULL,
  `cu_state` tinyint(4) NOT NULL DEFAULT '0',
  `cu_createtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `cu_from` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0-工作人员，1-管理员',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cu_userid` (`cu_userid`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `sys_api` */

CREATE TABLE `sys_api` (
  `sa_id` varchar(32) NOT NULL COMMENT 'api接口id',
  `sa_uri` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'api接口地址',
  `sa_desc` varchar(32) DEFAULT NULL COMMENT 'api接口描述',
  PRIMARY KEY (`sa_id`),
  UNIQUE KEY `sa_uri` (`sa_uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `sys_role` */

CREATE TABLE `sys_role` (
  `r_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色id',
  `r_pid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色父id',
  `r_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色名称',
  `r_desc` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色描述',
  `r_order` smallint(6) DEFAULT NULL COMMENT '角色序号',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `sys_roleapi` */

CREATE TABLE `sys_roleapi` (
  `ra_roleid` varchar(32) DEFAULT NULL COMMENT '角色id',
  `ra_apiid` varchar(32) DEFAULT NULL COMMENT 'api接口id',
  `ra_get` tinyint(4) DEFAULT '0' COMMENT 'get请求权限0-False,1-True',
  `ra_post` tinyint(4) DEFAULT '0' COMMENT 'post请求权限0-False,1-True',
  `ra_put` tinyint(4) DEFAULT '0' COMMENT 'put请求权限0-False,1-True',
  `ra_delete` tinyint(4) DEFAULT '0' COMMENT 'delete请求权限0-False,1-True',
  KEY `ra_roleid` (`ra_roleid`),
  KEY `ra_apiid` (`ra_apiid`),
  CONSTRAINT `sys_roleapi_ibfk_1` FOREIGN KEY (`ra_roleid`) REFERENCES `sys_role` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_roleapi_ibfk_2` FOREIGN KEY (`ra_apiid`) REFERENCES `sys_api` (`sa_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `sys_roleuser` */

CREATE TABLE `sys_roleuser` (
  `ru_roleid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色id',
  `ru_userid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户id',
  KEY `ru_roleid` (`ru_roleid`),
  CONSTRAINT `sys_roleuser_ibfk_1` FOREIGN KEY (`ru_roleid`) REFERENCES `sys_role` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/* Trigger structure for table `busi_tzcord` */

DELIMITER $$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `ins_tzcode` AFTER INSERT ON `busi_tzcord` FOR EACH ROW BEGIN
	if NEW.t_from=0 then
		INSERT INTO `busi_tzflow`(`t_id`,`t_codeid`) VALUES(REPLACE(uuid(),'-',''),NEW.t_uid);
	else
		INSERT INTO `busi_tzflow`(`t_id`,`t_codeid`,`t_state`) VALUES(REPLACE(UUID(),'-',''),NEW.t_uid,1);
	end if;
    END */$$


DELIMITER ;

/* Trigger structure for table `comp_sysuer` */

DELIMITER $$

/*!50003 CREATE */ /*!50017 DEFINER = 'root'@'%' */ /*!50003 TRIGGER `ins_sysuser` AFTER INSERT ON `comp_sysuer` FOR EACH ROW BEGIN
	INSERT INTO sys_roleuser VALUES('201812130002',NEW.cu_userid);
    END */$$


DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
