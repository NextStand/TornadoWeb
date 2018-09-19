/*
SQLyog Ultimate v12.5.0 (64 bit)
MySQL - 8.0.11 : Database - db_tornado
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_tornado` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_tornado`;

/*Table structure for table `sys_api` */

DROP TABLE IF EXISTS `sys_api`;

CREATE TABLE `sys_api` (
  `sa_id` varchar(32) NOT NULL COMMENT 'api接口id',
  `sa_uri` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'api接口地址',
  `sa_desc` varchar(32) DEFAULT NULL COMMENT 'api接口描述',
  PRIMARY KEY (`sa_id`),
  UNIQUE KEY `sa_uri` (`sa_uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_api` */

insert  into `sys_api`(`sa_id`,`sa_uri`,`sa_desc`) values 
('0ec1106033954bd5b1fce6bd7370fa88','/','主页'),
('a5f32878c73f46e695338b55a7942dfd','/login','登录');

/*Table structure for table `sys_menu` */

DROP TABLE IF EXISTS `sys_menu`;

CREATE TABLE `sys_menu` (
  `sm_menuid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '功能菜单id',
  `sm_pmenuid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '功能菜单父id',
  `sm_caption` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '功能菜单名称',
  `sm_urladdr` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '功能菜单get方式url',
  `sm_order` smallint(6) DEFAULT NULL COMMENT '序号',
  PRIMARY KEY (`sm_menuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_menu` */

insert  into `sys_menu`(`sm_menuid`,`sm_pmenuid`,`sm_caption`,`sm_urladdr`,`sm_order`) values 
('1',NULL,'测试菜单',NULL,NULL),
('2',NULL,'测试菜单2',NULL,NULL);

/*Table structure for table `sys_menuapi` */

DROP TABLE IF EXISTS `sys_menuapi`;

CREATE TABLE `sys_menuapi` (
  `ma_menuid` varchar(32) DEFAULT NULL,
  `ma_apiid` varchar(32) DEFAULT NULL,
  KEY `ma_menuid` (`ma_menuid`),
  KEY `ma_apiid` (`ma_apiid`),
  CONSTRAINT `sys_menuapi_ibfk_1` FOREIGN KEY (`ma_menuid`) REFERENCES `sys_menu` (`sm_menuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_menuapi_ibfk_2` FOREIGN KEY (`ma_apiid`) REFERENCES `sys_api` (`sa_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_menuapi` */

/*Table structure for table `sys_role` */

DROP TABLE IF EXISTS `sys_role`;

CREATE TABLE `sys_role` (
  `r_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色id',
  `r_pid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色父id',
  `r_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色名称',
  `r_desc` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色描述',
  `r_order` smallint(6) DEFAULT NULL COMMENT '角色序号',
  PRIMARY KEY (`r_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_role` */

insert  into `sys_role`(`r_id`,`r_pid`,`r_name`,`r_desc`,`r_order`) values 
('000000',NULL,'游客','该角色为公众用户的角色',NULL),
('7faf1e95690f4350af0f43089b697cf9',NULL,'开发者','该角色为开发者，应该拥有最高权限',NULL);

/*Table structure for table `sys_roleapi` */

DROP TABLE IF EXISTS `sys_roleapi`;

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

/*Data for the table `sys_roleapi` */

insert  into `sys_roleapi`(`ra_roleid`,`ra_apiid`,`ra_get`,`ra_post`,`ra_put`,`ra_delete`) values 
('000000','0ec1106033954bd5b1fce6bd7370fa88',1,0,0,0),
('000000','a5f32878c73f46e695338b55a7942dfd',1,1,0,0),
('7faf1e95690f4350af0f43089b697cf9','0ec1106033954bd5b1fce6bd7370fa88',1,1,1,1),
('7faf1e95690f4350af0f43089b697cf9','a5f32878c73f46e695338b55a7942dfd',1,1,1,1);

/*Table structure for table `sys_rolemenu` */

DROP TABLE IF EXISTS `sys_rolemenu`;

CREATE TABLE `sys_rolemenu` (
  `sr_menuid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '功能菜单id',
  `sr_roleid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '角色id',
  KEY `sr_menuid` (`sr_menuid`),
  KEY `sr_roleid` (`sr_roleid`),
  CONSTRAINT `sys_rolemenu_ibfk_1` FOREIGN KEY (`sr_menuid`) REFERENCES `sys_menu` (`sm_menuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_rolemenu_ibfk_2` FOREIGN KEY (`sr_roleid`) REFERENCES `sys_role` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_rolemenu` */

insert  into `sys_rolemenu`(`sr_menuid`,`sr_roleid`) values 
('1','000000'),
('2','000000');

/*Table structure for table `sys_roleuser` */

DROP TABLE IF EXISTS `sys_roleuser`;

CREATE TABLE `sys_roleuser` (
  `ru_roleid` varchar(32) DEFAULT NULL COMMENT '角色id',
  `ru_userid` varchar(32) DEFAULT NULL COMMENT '用户id',
  KEY `ru_roleid` (`ru_roleid`),
  KEY `ru_userid` (`ru_userid`),
  CONSTRAINT `sys_roleuser_ibfk_1` FOREIGN KEY (`ru_roleid`) REFERENCES `sys_role` (`r_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_roleuser_ibfk_2` FOREIGN KEY (`ru_userid`) REFERENCES `sys_users` (`u_uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_roleuser` */

insert  into `sys_roleuser`(`ru_roleid`,`ru_userid`) values 
('7faf1e95690f4350af0f43089b697cf9','e04c31a9ff594be9baa9a665b93095e6');

/*Table structure for table `sys_users` */

DROP TABLE IF EXISTS `sys_users`;

CREATE TABLE `sys_users` (
  `u_uid` varchar(32) NOT NULL,
  `u_username` varchar(32) DEFAULT NULL COMMENT '用户名',
  `u_password` varchar(32) DEFAULT NULL COMMENT '用户密码MD5',
  PRIMARY KEY (`u_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `sys_users` */

insert  into `sys_users`(`u_uid`,`u_username`,`u_password`) values 
('e04c31a9ff594be9baa9a665b93095e6','admin','42C689808B2EDFAA5B2D9D4E12ACB5F6');

/* Procedure structure for procedure `get_menu_power` */

/*!50003 DROP PROCEDURE IF EXISTS  `get_menu_power` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`%` PROCEDURE `get_menu_power`(in uid varchar (32))
BEGIN
  SELECT
    sm_caption,
    sm_urladdr
  FROM
    sys_menu
  WHERE sm_menuid IN
    (SELECT
      sr_menuid
    FROM
      sys_rolemenu
    WHERE sr_roleid IN
      (SELECT
        ru_roleid
      FROM
        sys_roleuser
      WHERE ru_userid = uid))
  ORDER BY sm_order;
END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
