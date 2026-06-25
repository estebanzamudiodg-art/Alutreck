-- ============================================================
--  DATOS · 3 modelos de Alutreck. Ejecuta DESPUÉS de schema.sql.
--  Ajusta las descripciones con el texto definitivo desde el panel admin.
-- ============================================================
insert into modelos (nombre, slug, resumen, descripcion, orden, specs) values
('Arawana','arawana',
 'Ágil y estable, pensada para pesca y recreación en río.',
 'La Arawana es una embarcación en aluminio naval ágil y estable, ideal para pesca y recreación en ríos, lagunas y embalses. Casco diseñado para buena maniobrabilidad y un andar seguro.',
 1,'{"forma":"v","hex":"#8A9499","usos":["Pesca","Recreación","Navegación en río"]}'),
('Semichata','semichata',
 'Equilibrio entre capacidad de carga y navegabilidad.',
 'La Semichata combina capacidad de carga con buena navegabilidad: una opción intermedia para trabajo y transporte donde se necesita mover carga sin sacrificar el desempeño.',
 2,'{"forma":"v","hex":"#7A858B","usos":["Trabajo","Transporte","Carga media"]}'),
('Chata','chata',
 'Fondo plano, máxima capacidad de carga y estabilidad.',
 'La Chata es una embarcación de fondo plano construida para máxima capacidad de carga y estabilidad. Pensada para transporte fluvial y trabajo pesado en aguas tranquilas.',
 3,'{"forma":"pontoon","hex":"#6F7B82","usos":["Transporte fluvial","Carga pesada","Trabajo"]}');
