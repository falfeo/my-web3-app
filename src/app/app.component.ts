import {Component, Inject, OnInit} from '@angular/core';
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

  constructor(@Inject(WEB3) private web3: Web3) {
  }

  async ngOnInit() {
    const prov = this.web3.currentProvider as any;
    if ('enable' in prov) {
      console.log("not enabled, enabling....");
      await prov.enable();
    }
    const accounts = await this.web3.eth.getAccounts();
    console.log(accounts);
    const balance = await this.web3.eth.getBalance(accounts[0]);
    this.balance = this.web3.utils.fromWei(balance) + ' ETH';
    this.web3.eth.net.getId().then(netId => {
      switch (netId) {
        case 1:
          this.networkConnectedTo = 'Ethereum mainnet';
          break
        case 2:
          this.networkConnectedTo = 'Deprecated Morden test network';
          break
        case 3:
          this.networkConnectedTo = 'Ropsten test network';
          break
        default:
          this.networkConnectedTo = 'Unknown network.';
      }
    })
  }
}
