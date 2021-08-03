import React, { useState, useEffect } from 'react';
import '../styles.css';
import '../../../styles/login.css';

import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';

import { obterTokenDaStorage } from '../../../utils/Storage';
import { obterDadosUsuario } from '../../../services/ApiUsuario';

const useStyles = makeStyles((theme) => ({
  fecharJanela: {
    width: 25,
    height: 25,
    marginLeft: 235,
    marginTop: 5,
    color: '#094B89',
  },

  field: {
    marginBottom: 15,
  },

  avatar: {
    clipPath: 'circle(21%)',
    height: 102,
    margin: 0,
    padding: 0
  },

  user: {
    height: '92%'
  },

  input: {
    display: 'none',
  },

}));

export default function SimpleModal({ children }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [usuarioLogado, setUsuarioLogado] = useState({});
  const [imagem, setImagem] = useState(null);

  const handleFile = (e) => {
    const content = e.target.result;
    setImagem(content);
  }

  const handleChangeFile = (img) => {
    if (img.size > 18600) { // ver limite certo na api
      alert('imagem grande demais!');

      return;
    }

    const fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsDataURL(img);
  }

  const handleConfirmar = (e) => {
    e.preventDefault();

    console.log(imagem);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let [, idUsuario] = obterTokenDaStorage();

    obterDadosUsuario(idUsuario)
      .then((resposta) => {
        const usuario = resposta.data;

        setUsuarioLogado(usuario);
        setImagem(usuario.url);
      })
      .catch((erro) => {
        alert("Erro! Verifique o console.");
        console.error(erro);
        // setCarregar(false);
      })
  }, []);

  return (
    <>
      {usuarioLogado == null ?
        ''
        :
        <div>
          <Tooltip title="Cadastrar membro" arrow>
            <button className="buttonModal" color="secondary" onClick={handleClickOpen}>
              {children}
            </button>
          </Tooltip>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ width: "100%" }}
          >

            <form className="form" style={{ width: "270px", height: "470px" }}
              onSubmit={e => handleConfirmar(e)} >
              <center>
                <CloseIcon className={classes.fecharJanela} onClick={handleClose} />
                <h3 style={{ textAlign: 'center', marginTop: -5 }}>Perfil</h3>


                <h3 className={classes.avatar}>
                  <img className={classes.user} src={imagem} />
                </h3>

                {/* --------Botão camera-------- */}

                <div className={classes.root}>

                  {
                    /* value={''} para resetar valor do input
                    e garantir que o evento onChange sempre aconteça
                    para tratativas de tamanho etc.               
                    */
                  }
                  <input accept="image/*" className={classes.input} id="icon-button-file"
                    type="file" value={''} onChange={e => handleChangeFile(e.target.files[0])} />
                  <label htmlFor="icon-button-file">
                    <IconButton color="secondary" aria-label="upload picture" component="span">
                      <AddAPhoto />
                    </IconButton>
                  </label>
                </div>

                <TextField
                  className={classes.field}
                  name="Nome"
                  label={usuarioLogado.nome}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onChange={(e) => setUsername(e.target.value)}
                />


                {/* checar se cargo pode ser null */}
                <TextField
                  className={classes.field}
                  name="Papel"
                  label={usuarioLogado.nomeCargo}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  name="Status"
                  label={usuarioLogado.status}
                  variant="outlined"
                  type="string"
                  size="small"
                  color="secondary"
                  onChange={(e) => setSenha(e.target.value)}
                />

              </center>

              <DialogActions style={{ alignItems: 'center', justifyContent: 'center' }}>
                <button className="buttonConfirmar" onClick={handleClose} >
                  Confirmar
                </button>
              </DialogActions>
            </form>
          </Dialog>

        </div>
      }
    </>

  );
}