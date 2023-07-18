CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `templeview` AS
    SELECT 
        `temple`.`templeid` AS `templeid`,
        `temple`.`name` AS `name`,
        `temple`.`address` AS `address`,
        `temple`.`city` AS `city`,
        `temple`.`pincode` AS `pincode`,
        `state`.`state` AS `state`
    FROM
        (`temple`
        JOIN `state`)
    WHERE
        (`temple`.`stateid` = `state`.`stateid`)