-- ============================================================
--  DATOS · Categorías de producto de Alutreck. Ejecuta DESPUÉS de schema.sql.
-- ============================================================
insert into categories (nombre, slug, resumen, descripcion, orden, specs) values
('Botes de pesca','botes-de-pesca',
 'Estabilidad, comodidad y seguridad para largas jornadas de pesca recreativa o deportiva.',
 'Embarcaciones en aluminio naval diseñadas para la pesca recreativa y deportiva. Buscan estabilidad en el agua, espacio de trabajo a bordo y una navegación segura durante jornadas extensas en ríos, lagunas y embalses.',
 1,'{"forma":"v","hex":"#8A9499","usos":["Pesca recreativa","Pesca deportiva","Salidas de jornada completa"]}'),
('Embarcaciones recreativas','embarcaciones-recreativas',
 'Ideales para paseos familiares, turismo y actividades de entretenimiento en el agua.',
 'Pensadas para el disfrute: paseos en familia, turismo y actividades de entretenimiento. Combinan la durabilidad del aluminio naval con una distribución cómoda para acompañantes.',
 2,'{"forma":"v","hex":"#7E8A90","usos":["Paseos familiares","Turismo","Recreación"]}'),
('Embarcaciones para trabajo','embarcaciones-de-trabajo',
 'Modelos robustos, reforzados y funcionales para operaciones comerciales e institucionales.',
 'Construcción reforzada para operación comercial, institucional y de transporte. Priorizan resistencia estructural, bajo mantenimiento y funcionalidad en condiciones de uso exigente.',
 3,'{"forma":"v","hex":"#6F7B82","usos":["Operación comercial","Uso institucional","Transporte de carga"]}'),
('Transporte fluvial','transporte-fluvial',
 'Diseñadas para movilizar personas y carga con seguridad y eficiencia.',
 'Embarcaciones orientadas a movilizar pasajeros y carga por vías fluviales, con foco en seguridad, capacidad y eficiencia en el desplazamiento.',
 4,'{"forma":"pontoon","hex":"#7A858B","usos":["Transporte de pasajeros","Movilización de carga","Conexión fluvial"]}'),
('Diseños personalizados','disenos-personalizados',
 'Proyectos especiales adaptados a los requerimientos específicos de cada cliente.',
 'Desarrollamos proyectos a la medida: adaptamos dimensiones, distribución, capacidad y equipamiento según lo que necesitas. Cuéntanos el uso previsto y nuestro equipo propone la embarcación adecuada.',
 5,'{"forma":"v","hex":"#8A9499","usos":["Dimensiones a medida","Distribución personalizada","Equipamiento específico"]}'),
('Accesorios y equipamiento','accesorios-equipamiento',
 'Opciones de personalización y equipamiento para mejorar funcionalidad y comodidad.',
 'Complementos y equipamiento para tu embarcación: opciones de personalización que mejoran la funcionalidad, la comodidad y el rendimiento de cada bote.',
 6,'{"forma":"v","hex":"#94A0A6","usos":["Personalización","Equipamiento a bordo","Mejoras de comodidad"]}');
