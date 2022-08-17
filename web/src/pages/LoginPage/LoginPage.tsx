import { Link, navigate, routes } from '@redwoodjs/router'
import {useRef, useState} from 'react'
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'
import { useEffect } from 'react'
import {useApolloClient} from "@apollo/client";
import {Spin} from "antd/es";
import {Alert, Input} from "antd";



const LoginPage = () => {

  const QRCode = ( {id} ) =>
  {
    const client = useApolloClient();
    const [qrCodeOk, setQrCodeOk] = useState(-1);
    const qrCodeRef = useRef<HTMLInputElement>();
    useEffect(()=>{
      qrCodeRef.current.focus();
    },[]);

    const onSubmit = async (data) =>
    {
      setQrCodeOk(-1);

      const qrcode:string = data.qrcode;
      const MUTATION = gql`
                  mutation SetMfaCode($id: Int!, $qrcode: String!) {
                    setMfaCode(id: $id, qrcode: $qrcode)
                  }`;
      client.mutate({
        mutation: MUTATION,
        variables: { id: id, qrcode: qrcode }
      })
        .then( ret => {
          console.log( ret );
          const result:number = ret.data.setMfaCode;
          setQrCodeOk( result );
          // toast.success('Object was deeply cloned' );
          // setClonedQaObject( ret.data.deepClone );
          // afterSave( ret.data.deepClone );
        })
        .catch( error => {
          toast.error( error.message );
          // setIsModalVisible(false);
        } );
    }


    return (
      <Form onSubmit={onSubmit} className="rw-form-wrapper">
        <Label
          name="qrcode"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          QRCode
        </Label>
        <TextField
          name="qrcode"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          ref={qrCodeRef}
          validation={{
            required: {
              value: true,
              message: 'QRCode is required',
            },
          }}
        />
        <FieldError name="qrcode" className="rw-field-error" />

        { qrCodeOk === 0 && <Alert type={"error"} showIcon={true} message="Please check QR code" /> }

        <div className="rw-button-group">
          <Submit className="rw-button rw-button-blue">Submit</Submit>
        </div>

      </Form>
      );
    }

  const QRCodeImage = ( {id} ) =>
  {
    const client = useApolloClient();
    const QUERY = gql`
      query ShowQrCodeImage($id: Int!) {
        showQrCodeImage: showQrCodeImage(id: $id)
      }`;

    const [qrImage, setQrImage] = useState(null);


    useEffect( () => {
      client.query({
        query: QUERY,
        variables: { id: id }
      })
      .then( res =>
      {
        setQrImage( res.data.showQrCodeImage );
      });
    }, [] );

    return !qrImage ?
      <Spin/> :
      <table>
        <tbody>
          <tr>
            <td><img src={qrImage} alt="QR Code"/></td>
          </tr>
          <tr>
            <td>
              <QRCode id={id} />
            </td>
          </tr>
        </tbody>
      </table>

  }

  const { isAuthenticated, logIn, currentUser, hasRole } = useAuth();

  const STATE_LOGIN_FORM = 'Login';
  const STATE_LOGIN_CODE_FORM = 'Login User Password Code';
  const STATE_NO_2FA = 'Scan image with your device';
  const STATE_ENTER_CODE_2FA = 'Enter the code from your device';
  const [state,setState] = useState(STATE_LOGIN_FORM);
  const [userWithout2FASetupCodeID, setUserWithout2FASetupCodeID] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const usernameRef = useRef<HTMLInputElement>()
  useEffect(() => {
    usernameRef.current.focus()
  }, [])

  const onSubmit = async (data) => {
    const loginData = {username:data.username, password:data.password, qrcode:data.qrcode};
    const response = await logIn({username:JSON.stringify(loginData)});
    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      const mfa:number = response.mfa;
      if ( mfa === 0 )
      {
        setUserWithout2FASetupCodeID( response.id );
        setState( STATE_NO_2FA );
      }
      else if ( mfa === 2 )
      {
        setState( STATE_LOGIN_CODE_FORM );
      }
      else
        toast.success('Welcome back!')
    }
  }

  return (
    <>
      <MetaTags title="Login" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">{state}</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">

                { (state === STATE_LOGIN_FORM || state === STATE_LOGIN_CODE_FORM) &&
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Username
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />

                  <div className="rw-forgot-link">
                    <Link to={routes.forgotPassword()} className="rw-forgot-link">
                      Forgot Password?
                    </Link>
                  </div>

                  <FieldError name="password" className="rw-field-error" />

                  { state === STATE_LOGIN_CODE_FORM &&
                    <>
                      <Label
                        name="qrcode"
                        className="rw-label"
                        errorClassName="rw-label rw-label-error"
                      >
                        QRCode
                      </Label>
                      <TextField
                        name="qrcode"
                        className="rw-input"
                        errorClassName="rw-input rw-input-error"
                        // ref={qrCodeRef}
                        validation={{
                          required: {
                            value: true,
                            message: 'QRCode is required',
                          },
                        }}
                      />
                      <FieldError name="qrcode" className="rw-field-error" />
                    </>
                  }

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">Login</Submit>
                  </div>
                </Form>
                }

                { state === STATE_NO_2FA && <QRCodeImage id={userWithout2FASetupCodeID}/> }

              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Don&apos;t have an account?</span>{' '}
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
