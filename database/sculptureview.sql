
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `sculptureview` AS
    SELECT 
        `sculpture`.`sculptureid` AS `sculptureid`,
        `sculpture`.`sculpturename` AS `sculpturename`,
        `sculpture`.`image` AS `image`,
        `sculpture`.`keyword` AS `keyword`,
        `temple`.`templeid` AS `templeid`,
        `temple`.`name` AS `name`,
        `temple`.`address` AS `address`,
        `temple`.`city` AS `city`,
        `temple`.`state` AS `state`,
        `temple`.`pincode` AS `pincode`
    FROM
        (`sculpture`
        JOIN `temple` ON ((`sculpture`.`templeid` = `temple`.`templeid`)))