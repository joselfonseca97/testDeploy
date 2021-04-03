------TABLES-------

CREATE TABLE usuarios(
id INT IDENTITY (1,1) NOT NULL,
name VARCHAR(255) NOT NULL,
username VARCHAR(255) NOT NULL,
password VARCHAR (255) NOT NULL,
isonline BIT DEFAULT 0
);
GO

CREATE TABLE games(
	id INT IDENTITY (1,1) NOT NULL,
	player1 INT NOT NULL,
	player2 INT DEFAULT NULL,
	winner INT DEFAULT NULL,
	minutes INT DEFAULT 0,
	seconds INT DEFAULT 0,
	downSeconds INT DEFAULT 0,
	turn VARCHAR(255) DEFAULT ' ',
	turnColor INT DEFAULT 0,
	matrixSize INT DEFAULT 7,
	matrix VARCHAR(255)
);
GO

select * from usuarios
------FUNCTIONS--------

------->
CREATE PROC agregarUsuario
	@name VARCHAR(255),
	@username VARCHAR(255),
	@password VARCHAR(255)
AS
	INSERT INTO usuarios (name,username,password) VALUES(@name,@username,@password)
GO

------->
CREATE FUNCTION getUsuarios()
	RETURNS TABLE
AS 
	RETURN (SELECT * FROM usuarios)
GO
------->

CREATE PROC setOfflineUsuario
	@username VARCHAR(255)
AS
	UPDATE usuarios
		SET isonline= 0
		WHERE username=@username
GO

CREATE PROC setOnlineUsuario  -- CHANGES THE STATE OF A USER (IF ITS ONLINE OR NOT), RECEIVES THE USERNAME AS A PARAMETER
	@username VARCHAR(255)
AS
	UPDATE usuarios 
		SET isonline=1
	WHERE username=@username
GO

------->
CREATE PROC createGame(
	@player1 VARCHAR(255),
	@matrixSize INT,
	@matrix VARCHAR(255)
	)
AS
	BEGIN
		DECLARE @idUsuario INT
		SET @idUsuario = (SELECT id FROM usuarios WHERE username=@player1)

		INSERT INTO games(player1,matrixSize,matrix) VALUES (@idUsuario,@matrixSize,@matrix)
	END
GO
------->

--returns the id of the last game created
CREATE FUNCTION getLastGame()
	RETURNS INT
AS	
	BEGIN
		RETURN (SELECT MAX(id) AS id FROM games)
	END
GO

------->
5

--update the state of a game
CREATE PROC updateGame(
	@idGame INT,
	@minutes INT,
	@seconds INT,
	@winner INT,
	@downSeconds INT,
	@turn VARCHAR(255),
	@turnColor INT
)
AS
	BEGIN
		UPDATE games
		SET winner=@winner, minutes=@minutes,seconds=@seconds,downSeconds=@downSeconds,turn=@turn,turnColor=@turnColor
			
		WHERE id=@idGame
	END
GO

------->

--returns the state of a game
CREATE FUNCTION getGame(
	@idGame INT
)
	RETURNS TABLE
AS
	RETURN (SELECT * FROM games WHERE id=@idGame)
GO

select * from getGame(1)


------->
CREATE FUNCTION getMatrix(
	@idGame INT
)
	RETURNS TABLE
AS
		RETURN (SELECT matrix FROM games WHERE id=@idGame)
GO


CREATE PROC updateMatrix(
	@idGame INT,
	@matrix VARCHAR(255)
)
AS
	BEGIN
		UPDATE games
		SET matrix= @matrix 
		WHERE id=@idGame
	END
GO
------->


ALTER FUNCTION getTurn (@idGame INT)
	RETURNS INT
AS
	BEGIN
		DECLARE @turn INT
		SELECT @turn = turn FROM OnlineGame WHERE id = @idGame
		RETURN @turn
	END
GO

CREATE FUNCTION getTurn2(
	@idGame INT
)
	RETURNS TABLE
AS
		RETURN turn FROM onlineGame WHERE id=@idGame
GO






select * from usuarios




