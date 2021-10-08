import {ChangeDetectorRef, Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {WEB3} from "./web3";
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public networkConnectedTo = '';
  public balance = '';
  public address = '';
  change: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(WEB3) private web3: Web3,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    const prov = this.web3.currentProvider as any;
    if (!prov) {
      this.networkConnectedTo = 'Need a wallet extension, try Metamask!';
      return;
    }
    if ('enable' in prov) {
      console.log("not enabled, enabling....");
      prov.enable().then(()=> {
        this.loadAccountInfo();
      })
    }
    // @ts-ignore
    window.ethereum.on('networkChanged',  (networkId) => {
      console.log("changed");
      this.loadAccountInfo();
    })
  }

  private loadAccountInfo() {
    console.log('loadAccountInfo');
    this.web3.eth.getAccounts().then((accounts) => {
      this.address = accounts[0];
      this.web3.eth.getBalance(accounts[0]).then((balance) => {
        this.balance = this.web3.utils.fromWei(balance);
        this.ref.detectChanges();
      })
      this.web3.eth.net.getId().then(netId => {
        console.log(netId);
        switch (netId) {
          case 1:
            this.networkConnectedTo = 'Connected to Ethereum mainnet!';
            break
          case 2:
            this.networkConnectedTo = 'Connected to Deprecated Morden test network!';
            break
          case 3:
            this.networkConnectedTo = 'Connected to Ropsten test network';
            break
          default:
            this.web3.eth.net.getNetworkType((networkName) => {
              this.networkConnectedTo = 'Connected to ' + networkName;
            })
        }
        this.ref.detectChanges();
      })
      this.ref.detectChanges();
    })
  }
}
